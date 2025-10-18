const REFRESH_INTERVAL_MINUTES = 5;
const PRICE_CHANGE_THRESHOLD_PERCENT = 10;
const HISTORY_LIMIT = 288; // 24 hours of 5-minute samples
const TRACKED_PLAYERS_KEY = 'futbinTrackedPlayers';
const LAST_REFRESH_KEY = 'futbinLastRefresh';

const FUTBIN_SEARCH_URL = 'https://www.futbin.com/search?year=25&term=';
const FUTBIN_PRICES_URL = 'https://www.futbin.com/25/playerPrices?player=';

/**
 * Wraps chrome.storage.local.get in a promise for async/await usage.
 * @param {string[]} keys
 * @returns {Promise<Record<string, any>>}
 */
function getFromStorage(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => {
            resolve(result || {});
        });
    });
}

/**
 * Wraps chrome.storage.local.set in a promise for async/await usage.
 * @param {Record<string, any>} data
 * @returns {Promise<void>}
 */
function setInStorage(data) {
    return new Promise((resolve) => {
        chrome.storage.local.set(data, () => resolve());
    });
}

/**
 * Safely send a message to any runtime listeners without throwing when
 * no listeners are available.
 * @param {any} payload
 */
function safeSendMessage(payload) {
    try {
        chrome.runtime.sendMessage(payload, () => {
            const error = chrome.runtime.lastError;
            if (error) {
                console.debug('PlayerHeadShot background message dispatch issue:', error.message);
            }
        });
    } catch (error) {
        console.warn('PlayerHeadShot background failed to dispatch message', error);
    }
}

/**
 * Fetch Futbin search results for a player name and return the first match.
 * @param {string} name
 * @returns {Promise<Object|null>}
 */
async function fetchPlayerMetadata(name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return null;
    }

    const response = await fetch(`${FUTBIN_SEARCH_URL}${encodeURIComponent(trimmedName)}`, {
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
    });

    if (!response.ok) {
        throw new Error(`Unable to find Futbin player for ${trimmedName}.`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || !payload.length) {
        return null;
    }

    const [primary] = payload;
    return primary || null;
}

/**
 * Extract a numeric price and display string from Futbin platform price data.
 * @param {Record<string, any>} platformData
 * @returns {{ raw: number, display: string } | null}
 */
function extractPrice(platformData) {
    if (!platformData) {
        return null;
    }

    const candidateKeys = [
        'LCPriceRaw',
        'LCPrice',
        'LCPrice2',
        'LCPrice3',
        'LCPrice4',
        'LCPrice5',
        'LCPrice6'
    ];

    for (const key of candidateKeys) {
        const value = platformData[key];
        if (value === undefined || value === null || value === '') {
            continue;
        }

        if (typeof value === 'number' && Number.isFinite(value)) {
            return {raw: value, display: value.toLocaleString()};
        }

        const numeric = Number(String(value).replace(/[^\d.-]+/g, ''));
        if (!Number.isNaN(numeric) && numeric > 0) {
            return {raw: numeric, display: typeof value === 'string' ? value : numeric.toLocaleString()};
        }
    }

    return null;
}

/**
 * Fetch the latest Futbin price for a player on the given platform.
 * @param {string|number} playerId
 * @param {string} platform
 * @returns {Promise<{ raw: number, display: string, updated: string } | null>}
 */
async function fetchPlayerPrice(playerId, platform) {
    const response = await fetch(`${FUTBIN_PRICES_URL}${playerId}`, {
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
    });

    if (!response.ok) {
        throw new Error(`Unable to load Futbin price for player ${playerId}.`);
    }

    const payload = await response.json();
    const prices = payload?.prices || payload?.Prices || payload;
    const platformData = prices?.[platform] || prices?.[platform.toUpperCase()] || prices?.[platform.toLowerCase()];
    if (!platformData) {
        return null;
    }

    const price = extractPrice(platformData);
    if (!price) {
        return null;
    }

    return {
        raw: price.raw,
        display: price.display,
        updated: platformData.updated || platformData.Updated || ''
    };
}

/**
 * Load tracked players from storage.
 * @returns {Promise<Record<string, any>>}
 */
async function loadTrackedPlayers() {
    const result = await getFromStorage([TRACKED_PLAYERS_KEY]);
    const players = result[TRACKED_PLAYERS_KEY] || {};
    const now = Date.now();
    let mutated = false;

    for (const key of Object.keys(players)) {
        const entry = players[key];
        if (!entry) {
            continue;
        }

        if (!entry.fakebin) {
            const history = Array.isArray(entry.history) ? entry.history : [];
            const latestHistory = history.length ? history[history.length - 1] : null;
            entry.fakebin = {
                active: false,
                source: 'futbin',
                lastAppliedPrice: entry.lastPrice || latestHistory?.price || null,
                lastAppliedDisplay: entry.lastDisplayPrice || latestHistory?.display || null,
                updated: entry.lastUpdated || now
            };
            mutated = true;
        } else if (!entry.fakebin.source) {
            entry.fakebin.source = 'futbin';
            mutated = true;
        }
    }

    if (mutated) {
        await storeTrackedPlayers(players);
    }

    return players;
}

/**
 * Persist tracked players to storage.
 * @param {Record<string, any>} players
 */
async function storeTrackedPlayers(players) {
    await setInStorage({[TRACKED_PLAYERS_KEY]: players});
}

/**
 * Persist the last refresh timestamp.
 * @param {number} timestamp
 */
async function storeLastRefresh(timestamp) {
    await setInStorage({[LAST_REFRESH_KEY]: timestamp});
}

/**
 * Transform the tracked players map into a sorted array for UI consumption.
 * @param {Record<string, any>} players
 * @returns {Array<any>}
 */
function serializeTrackedPlayers(players) {
    return Object.values(players)
        .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Broadcast the current tracked players to any listeners.
 * @param {Record<string, any>} players
 * @param {number} [lastRefresh]
 */
function broadcastTrackedPlayers(players, lastRefresh) {
    safeSendMessage({
        action: 'futbinTrackedPlayersUpdated',
        players: serializeTrackedPlayers(players),
        lastRefresh: lastRefresh || Date.now()
    });
}

/**
 * Broadcast a price alert to the popup and any other listeners.
 * @param {Object} alert
 */
function broadcastPriceAlert(alert) {
    safeSendMessage({
        action: 'futbinPriceAlert',
        alert
    });
}

/**
 * Evaluate price changes and determine if the movement crosses the defined threshold.
 * @param {number} previous
 * @param {number} current
 * @returns {{absolute: number, percent: number, direction: 'increase'|'decrease'|'flat'}}
 */
function evaluateChange(previous, current) {
    if (!previous || previous <= 0) {
        return {absolute: 0, percent: 0, direction: 'flat'};
    }

    const absolute = current - previous;
    const percent = (absolute / previous) * 100;
    const direction = absolute === 0 ? 'flat' : absolute > 0 ? 'increase' : 'decrease';
    return {absolute, percent, direction};
}

/**
 * Track a player by name and store the initial Futbin price snapshot.
 * @param {string} name
 * @param {string} [platform='ps']
 */
async function handleTrackPlayer(name, platform = 'ps') {
    const trimmedName = name.trim();
    if (!trimmedName) {
        throw new Error('Player name is required for Futbin tracking.');
    }

    const normalizedPlatform = platform.toLowerCase();
    const players = await loadTrackedPlayers();
    const existing = Object.values(players).find((entry) => entry.name.toLowerCase() === trimmedName.toLowerCase() && entry.platform === normalizedPlatform);
    if (existing) {
        return existing;
    }

    const metadata = await fetchPlayerMetadata(trimmedName);
    if (!metadata || !(metadata.player_id || metadata.id)) {
        throw new Error(`Futbin search returned no matches for ${trimmedName}.`);
    }

    const futbinId = String(metadata.player_id || metadata.id);
    const priceSnapshot = await fetchPlayerPrice(futbinId, normalizedPlatform);
    if (!priceSnapshot) {
        throw new Error(`No price data available for ${trimmedName} on ${normalizedPlatform.toUpperCase()}.`);
    }

    const timestamp = Date.now();
    const key = `${futbinId}_${normalizedPlatform}`;
    const historyEntry = {timestamp, price: priceSnapshot.raw, display: priceSnapshot.display};

    players[key] = {
        storageKey: key,
        id: futbinId,
        name: metadata.playername || metadata.name || metadata.value || trimmedName,
        rating: metadata.rating || metadata.player_rating || null,
        revision: metadata.version || metadata.player_type || metadata.revision || null,
        platform: normalizedPlatform,
        history: [historyEntry],
        lastPrice: priceSnapshot.raw,
        lastDisplayPrice: priceSnapshot.display,
        lastUpdated: timestamp,
        lastChange: {absolute: 0, percent: 0, direction: 'flat'},
        futbinUpdated: priceSnapshot.updated || '',
        fakebin: {
            active: false,
            source: 'futbin',
            lastAppliedPrice: priceSnapshot.raw,
            lastAppliedDisplay: priceSnapshot.display,
            updated: timestamp
        }
    };

    await storeTrackedPlayers(players);
    broadcastTrackedPlayers(players, timestamp);
    return players[key];
}

/**
 * Remove a tracked player by storage key.
 * @param {string} storageKey
 */
async function handleUntrackPlayer(storageKey) {
    if (!storageKey) {
        throw new Error('A valid storage key is required to remove tracked player data.');
    }

    const players = await loadTrackedPlayers();
    if (players[storageKey]) {
        delete players[storageKey];
        await storeTrackedPlayers(players);
        broadcastTrackedPlayers(players, Date.now());
    }
}

async function updateFakebinStatus(storageKey, active) {
    if (!storageKey) {
        throw new Error('A storage key is required to update fakebin status.');
    }

    const players = await loadTrackedPlayers();
    const entry = players[storageKey];
    if (!entry) {
        throw new Error('Tracked player not found for fakebin update.');
    }

    const now = Date.now();
    const history = Array.isArray(entry.history) ? entry.history : [];
    const latestHistory = history.length ? history[history.length - 1] : null;

    if (!entry.fakebin) {
        entry.fakebin = {
            active: false,
            source: 'futbin',
            lastAppliedPrice: entry.lastPrice || latestHistory?.price || null,
            lastAppliedDisplay: entry.lastDisplayPrice || latestHistory?.display || null,
            updated: entry.lastUpdated || now
        };
    }

    entry.fakebin.active = Boolean(active);
    entry.fakebin.updated = now;

    if (entry.fakebin.active && entry.fakebin.source === 'futbin') {
        entry.fakebin.lastAppliedPrice = entry.lastPrice || latestHistory?.price || null;
        entry.fakebin.lastAppliedDisplay = entry.lastDisplayPrice || latestHistory?.display || null;
    }

    await storeTrackedPlayers(players);
    broadcastTrackedPlayers(players, now);
    return entry;
}

/**
 * Refresh all tracked players by fetching the latest Futbin price snapshots.
 */
async function refreshTrackedPlayers() {
    const players = await loadTrackedPlayers();
    const keys = Object.keys(players);

    if (!keys.length) {
        const now = Date.now();
        await storeLastRefresh(now);
        broadcastTrackedPlayers(players, now);
        return;
    }

    const now = Date.now();
    for (const key of keys) {
        const entry = players[key];
        try {
            const priceSnapshot = await fetchPlayerPrice(entry.id, entry.platform);
            if (!priceSnapshot) {
                continue;
            }

            const previous = entry.lastPrice || (entry.history?.length ? entry.history[entry.history.length - 1].price : null);
            const change = evaluateChange(previous, priceSnapshot.raw);
            const historyEntry = {timestamp: now, price: priceSnapshot.raw, display: priceSnapshot.display};

            if (!Array.isArray(entry.history)) {
                entry.history = [];
            }

            if (!previous || priceSnapshot.raw !== previous) {
                entry.history.push(historyEntry);
                while (entry.history.length > HISTORY_LIMIT) {
                    entry.history.shift();
                }
            } else {
                // Even if the price did not change, ensure the timestamp is current.
                entry.history[entry.history.length - 1] = historyEntry;
            }

            entry.lastPrice = priceSnapshot.raw;
            entry.lastDisplayPrice = priceSnapshot.display;
            entry.lastUpdated = now;
            entry.lastChange = change;
            entry.futbinUpdated = priceSnapshot.updated || entry.futbinUpdated || '';

            if (!entry.fakebin) {
                entry.fakebin = {
                    active: false,
                    source: 'futbin',
                    lastAppliedPrice: priceSnapshot.raw,
                    lastAppliedDisplay: priceSnapshot.display,
                    updated: now
                };
            } else if (entry.fakebin.active && entry.fakebin.source === 'futbin') {
                entry.fakebin.lastAppliedPrice = priceSnapshot.raw;
                entry.fakebin.lastAppliedDisplay = priceSnapshot.display;
                entry.fakebin.updated = now;
            }

            if (Math.abs(change.percent) >= PRICE_CHANGE_THRESHOLD_PERCENT && change.direction !== 'flat') {
                broadcastPriceAlert({
                    player: {
                        name: entry.name,
                        platform: entry.platform,
                        rating: entry.rating,
                        revision: entry.revision
                    },
                    change: {
                        absolute: change.absolute,
                        percent: change.percent,
                        direction: change.direction,
                        newPrice: priceSnapshot.raw,
                        displayPrice: priceSnapshot.display,
                        timestamp: now
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to refresh Futbin price for', entry?.name, error);
        }
    }

    await storeTrackedPlayers(players);
    await storeLastRefresh(now);
    broadcastTrackedPlayers(players, now);
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('futbinPriceRefresh', {periodInMinutes: REFRESH_INTERVAL_MINUTES, delayInMinutes: REFRESH_INTERVAL_MINUTES});
    refreshTrackedPlayers().catch((error) => console.warn('Initial Futbin price refresh failed', error));
});

chrome.runtime.onStartup?.addListener(() => {
    refreshTrackedPlayers().catch((error) => console.warn('Startup Futbin price refresh failed', error));
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm?.name === 'futbinPriceRefresh') {
        refreshTrackedPlayers().catch((error) => console.warn('Scheduled Futbin price refresh failed', error));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || typeof request !== 'object') {
        return;
    }

    if (request.action === 'trackPlayerPrice') {
        handleTrackPlayer(request.name || '', request.platform || 'ps')
            .then((player) => sendResponse({success: true, player}))
            .catch((error) => sendResponse({success: false, message: error.message || String(error)}));
        return true;
    }

    if (request.action === 'untrackPlayer') {
        handleUntrackPlayer(request.storageKey || '')
            .then(() => sendResponse({success: true}))
            .catch((error) => sendResponse({success: false, message: error.message || String(error)}));
        return true;
    }

    if (request.action === 'refreshTrackedPlayersNow') {
        refreshTrackedPlayers()
            .then(() => sendResponse({success: true}))
            .catch((error) => sendResponse({success: false, message: error.message || String(error)}));
        return true;
    }

    if (request.action === 'setFakebinStatus') {
        updateFakebinStatus(request.storageKey || '', request.active)
            .then((player) => sendResponse({success: true, player}))
            .catch((error) => sendResponse({success: false, message: error.message || String(error)}));
        return true;
    }

    if (request.action === 'getTrackedPlayers') {
        Promise.all([
            loadTrackedPlayers(),
            getFromStorage([LAST_REFRESH_KEY])
        ]).then(([players, lastRefresh]) => {
            sendResponse({
                success: true,
                players: serializeTrackedPlayers(players),
                lastRefresh: lastRefresh[LAST_REFRESH_KEY] || null
            });
        }).catch((error) => {
            sendResponse({success: false, message: error.message || String(error)});
        });
        return true;
    }
});
