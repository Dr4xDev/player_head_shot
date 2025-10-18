<script setup>
/** Imports Vue's `onMounted` lifecycle hook and `ref` for reactive data. */
import {computed, onMounted, ref, watch} from 'vue';

/** Import custom components used in the template for UI elements. */
import CustomInput from "./components/CustomInput.vue";
import CustomButton from "./components/CustomButton.vue";
import CustomSlider from "./components/CustomSlider.vue";
import PlayerInput from "./components/PlayerInput.vue";
import AutoListCheckBox from "./components/AutoListCheckBox.vue";
import SnipingResults from "./components/SnipingResults.vue";
import CustomLog from "./components/CustomLog.vue";
import ThemeColorButton from "./components/ThemeColorButton.vue";

/**
 * @type {boolean} running - Flag to control whether the bot is currently running.
 * @type {boolean} advancedSettings - Flag to toggle the visibility of advanced settings.
 * @type {string} playerName - The name of the current player being searched.
 * @type {Array<Object>} nameList - List of player names and their ratings.
 * @type {number|undefined} searchLimit - The maximum number of searches allowed.
 * @type {number|undefined} minBuyNow - The minimum 'Buy Now' price for purchasing.
 * @type {number|undefined} maxBuyNow - The maximum 'Buy Now' price for purchasing.
 * @type {number|undefined} minListPrice - The minimum listing price when selling players.
 * @type {number|undefined} maxListPrice - The maximum listing price when selling players.
 * @type {number|undefined} searchResultDelay - The delay in milliseconds for search results to appear.
 * @type {number|undefined} confirmDialogDelay - The delay in milliseconds for confirming dialogs.
 * @type {number|undefined} confirmPurchaseDelay - The delay in milliseconds before confirming purchases.
 * @type {number} rpm - The number of rounds per minute for search iterations.
 * @type {boolean} autoListChecked - Flag to determine if auto-listing is enabled.
 * @type {number} searches - Counter for the number of search iterations.
 * @type {number} buys - Counter for successful purchases.
 * @type {number} fails - Counter for failed purchase attempts.
 * @type {Array<string>} logList - List of log entries tracking actions and events.
 * @type {number|undefined} profitRef - Reference to display calculated profit from sales.
 * @type {number} sliderKey - Key used to track the state of the custom slider for RPM.
 */
const running = ref(false);
const advancedSettings = ref(false);
const playerName = ref('');
const nameList = ref([]);
const searchLimit = ref();
const purchaseLimit = ref();
const minBuyNow = ref();
const maxBuyNow = ref();
const minListPrice = ref();
const maxListPrice = ref();
const searchResultDelay = ref();
const confirmDialogDelay = ref();
const confirmPurchaseDelay = ref();
const rpm = ref(60);
const autoListChecked = ref(false);
const searches = ref(0);
const buys = ref(0);
const fails = ref(0);
const logList = ref([]);
const profitRef = ref();
const sliderKey = ref(0);
const pricePlatform = ref('ps');
const trackedPlayers = ref([]);
const lastPriceRefresh = ref();
const priceTrackerLoading = ref(false);

const DEFAULT_THEME = Object.freeze({
    primaryColor: '#3091ae',
    secondaryColor: '#5b51ae'
});

const resolveRuntimeError = (runtimeError) => {
    if (!runtimeError) {
        return null;
    }

    const message = runtimeError.message || '';
    if (message.includes('Receiving end does not exist')) {
        return {type: 'noReceiver', error: runtimeError};
    }

    return {type: 'generic', error: runtimeError};
};

const sendMessageToActiveTab = async (payload) => {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab?.id) {
            console.warn('No active tab found for message', payload?.action);
            return {ok: false, reason: 'no-tab'};
        }

        return await new Promise((resolve) => {
            chrome.tabs.sendMessage(tab.id, payload, (response) => {
                const runtimeError = resolveRuntimeError(chrome.runtime.lastError);
                if (runtimeError) {
                    if (runtimeError.type === 'noReceiver') {
                        console.info(`Content script unavailable for ${payload?.action || 'message'}`);
                        resolve({ok: false, reason: 'no-receiver'});
                        return;
                    }

                    console.error('Failed to deliver message to active tab', runtimeError.error);
                    resolve({ok: false, reason: 'runtime-error', error: runtimeError.error});
                    return;
                }

                resolve({ok: true, response: response});
            });
        });
    } catch (error) {
        console.error('Unexpected error while sending message to active tab', payload, error);
        return {ok: false, reason: 'exception', error};
    }
};

const tabs = [
    {id: 'autobuyer', label: 'Autobuyer'},
    {id: 'watchlist', label: 'Watchlist'},
    {id: 'fakebins', label: 'Fakebins'}
];

const activeTab = ref('autobuyer');
const selectedFakebinKey = ref('');

const PRICE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const coinFormatter = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0});

const canTrackPrice = computed(() => !!(playerName.value && playerName.value.trim()));

const formattedLastRefresh = computed(() => formatTimestamp(lastPriceRefresh.value));
const formattedNextRefresh = computed(() => {
    if (!lastPriceRefresh.value) {
        return 'Pending…';
    }

    return formatTimestamp(lastPriceRefresh.value + PRICE_REFRESH_INTERVAL_MS);
});

const fakebinPlayers = computed(() =>
    (trackedPlayers.value || []).filter((player) => player?.fakebin?.active)
);

const selectedFakebin = computed(() => {
    if (!selectedFakebinKey.value) {
        return null;
    }

    return fakebinPlayers.value.find((player) => player.storageKey === selectedFakebinKey.value) || null;
});

/**
 * Formats a timestamp into a locale string suitable for UI display.
 *
 * @param {number|undefined|null} timestamp
 * @returns {string}
 */
const formatTimestamp = (timestamp) => {
    if (!timestamp) {
        return 'Never';
    }

    try {
        return new Date(timestamp).toLocaleString();
    } catch (error) {
        console.warn('Failed to format timestamp', timestamp, error);
        return '—';
    }
};

/**
 * Formats a coin value using the shared formatter.
 *
 * @param {number|string|undefined|null} value
 * @returns {string}
 */
const formatCoins = (value) => {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    const numeric = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]+/g, ''));
    if (!Number.isFinite(numeric)) {
        return '—';
    }

    return coinFormatter.format(Math.round(numeric));
};

/**
 * Formats the latest change for a tracked player.
 *
 * @param {{absolute?: number, percent?: number, direction?: string}|undefined} change
 * @returns {string}
 */
const formatChange = (change) => {
    if (!change || change.direction === 'flat' || !change.absolute) {
        return 'No major change';
    }

    const absolute = formatCoins(Math.abs(change.absolute));
    const percentValue = Number.isFinite(change.percent) ? Math.abs(change.percent).toFixed(2) : '0.00';
    const directionSymbol = change.direction === 'increase' ? '▲' : '▼';
    return `${directionSymbol} ${absolute} (${percentValue}%)`;
};

const pushLogEntry = (message) => {
    logList.value.push(`[${new Date().toLocaleString()}] ${message}`);
};

/**
 * Request the full set of tracked Futbin players from the background service worker.
 */
const requestTrackedPlayers = () => {
    try {
        chrome.runtime.sendMessage({action: 'getTrackedPlayers'}, (response) => {
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to load tracked Futbin players', runtimeError);
                return;
            }

            if (!response?.success) {
                console.warn('Failed to load tracked Futbin players', response?.message);
                return;
            }

            trackedPlayers.value = response.players || [];
            lastPriceRefresh.value = response.lastRefresh || undefined;
            syncFakebinSelection();
        });
    } catch (error) {
        console.error('Failed to request Futbin players', error);
    }
};

/**
 * Sends a Futbin tracking request to the background worker.
 *
 * @param {boolean} silent - When true, avoid logging success/error messages in the UI log.
 * @returns {Promise<{success: boolean, message?: string, player?: any}>}
 */
const sendTrackPlayerMessage = (silent = false) => {
    const trimmedName = playerName.value ? playerName.value.trim() : '';
    if (!trimmedName) {
        return Promise.resolve({success: false, message: 'Player name is required'});
    }

    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage({
                action: 'trackPlayerPrice',
                name: trimmedName,
                platform: pricePlatform.value
            }, (response) => {
                const runtimeError = chrome.runtime.lastError;
                if (runtimeError) {
                    if (!silent) {
                        logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${runtimeError.message}`);
                    }
                    resolve({success: false, message: runtimeError.message});
                    return;
                }

                if (!response?.success) {
                    if (!silent) {
                        logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${response?.message || 'Unknown error'}`);
                    }
                    resolve({success: false, message: response?.message});
                    return;
                }

                if (!silent) {
                    const trackedPlayer = response.player;
                    const platformLabel = (pricePlatform.value || 'ps').toUpperCase();
                    logList.value.push(`[${new Date().toLocaleString()}] Tracking ${trackedPlayer?.name || trimmedName} (${platformLabel}) on Futbin`);
                }

                resolve({success: true, player: response.player});
            });
        } catch (error) {
            if (!silent) {
                logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${error.message || error}`);
            }
            resolve({success: false, message: error.message || String(error)});
        }
    });
};

/**
 * Starts tracking the currently selected player on Futbin.
 */
const trackFutbinPrice = async () => {
    if (!canTrackPrice.value || priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    const result = await sendTrackPlayerMessage(false);
    priceTrackerLoading.value = false;
    if (result.success) {
        requestTrackedPlayers();
    }
};

/**
 * Triggers an on-demand refresh of the tracked Futbin price data.
 */
const manualRefreshTrackedPlayers = () => {
    if (priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    try {
        chrome.runtime.sendMessage({action: 'refreshTrackedPlayersNow'}, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Futbin refresh failed', runtimeError);
                logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${response?.message || 'Unknown error'}`);
                return;
            }

            logList.value.push(`[${new Date().toLocaleString()}] Futbin watchlist refreshed on demand`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Futbin refresh failed', error);
        logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${error.message || error}`);
    }
};

/**
 * Removes a tracked Futbin player from the watchlist.
 *
 * @param {any} player
 */
const removeTrackedPlayer = (player) => {
    if (!player || !player.storageKey || priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    try {
        chrome.runtime.sendMessage({action: 'untrackPlayer', storageKey: player.storageKey}, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to remove Futbin tracker', runtimeError);
                logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${response?.message || 'Unknown error'}`);
                return;
            }

            const platformLabel = player.platform ? player.platform.toUpperCase() : 'PS';
            logList.value.push(`[${new Date().toLocaleString()}] Stopped tracking ${player.name || 'player'} (${platformLabel}) on Futbin`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Failed to remove Futbin tracker', error);
        logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${error.message || error}`);
    }
};

const syncFakebinSelection = () => {
    const activePlayers = fakebinPlayers.value;
    if (!activePlayers.length) {
        if (selectedFakebinKey.value) {
            selectedFakebinKey.value = '';
        }
        return;
    }

    if (!activePlayers.some((player) => player.storageKey === selectedFakebinKey.value)) {
        selectedFakebinKey.value = activePlayers[0].storageKey;
    }
};

const setActiveTab = (tabId) => {
    if (tabs.some((tab) => tab.id === tabId)) {
        activeTab.value = tabId;
    }
};

const toggleFakebin = (player) => {
    if (!player || !player.storageKey || priceTrackerLoading.value) {
        return;
    }

    const nextState = !player.fakebin?.active;
    priceTrackerLoading.value = true;

    try {
        chrome.runtime.sendMessage({
            action: 'setFakebinStatus',
            storageKey: player.storageKey,
            active: nextState
        }, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to update fakebin status', runtimeError);
                pushLogEntry(`Fakebin toggle error: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                pushLogEntry(`Fakebin toggle error: ${response?.message || 'Unknown error'}`);
                return;
            }

            pushLogEntry(`${nextState ? 'Enabled' : 'Disabled'} fakebin for ${player.name || 'player'}`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Failed to update fakebin status', error);
        pushLogEntry(`Fakebin toggle error: ${error.message || error}`);
    }
};

const selectFakebin = (player) => {
    if (!player?.fakebin?.active) {
        return;
    }

    selectedFakebinKey.value = player.storageKey;
};

const applyFakebinToAutobuyer = async () => {
    const player = selectedFakebin.value;
    if (!player) {
        return;
    }

    const priceCandidate = player.fakebin?.lastAppliedPrice ?? player.lastPrice;
    const numericPrice = typeof priceCandidate === 'number' ? priceCandidate : Number(String(priceCandidate).replace(/[^\d.-]+/g, ''));
    const resolvedPrice = Number.isFinite(numericPrice) ? Math.max(0, Math.round(numericPrice)) : null;

    try {
        if (player.name) {
            await onPlayerSelected(player.name);
        }

        if (resolvedPrice !== null) {
            await onMinBuyNowChange(resolvedPrice);
            await onMaxBuyNowChange(resolvedPrice);
            onMinListPriceChange(resolvedPrice);
            onMaxListPriceChange(resolvedPrice);
            pushLogEntry(`Using Futbin fakebin for ${player.name || 'player'} at ${formatCoins(resolvedPrice)} coins`);
        } else {
            pushLogEntry(`Unable to apply fakebin price for ${player.name || 'player'}`);
        }
    } catch (error) {
        console.error('Failed to apply fakebin to autobuyer', error);
        pushLogEntry(`Failed to apply fakebin for ${player.name || 'player'}: ${error.message || error}`);
    }
};

watch(pricePlatform, (newValue) => {
    const normalized = (newValue || 'ps').toLowerCase();
    if (normalized !== newValue) {
        pricePlatform.value = normalized;
        return;
    }

    chrome.storage.local.set({pricePlatform: normalized}, function () {
    });
});

watch(fakebinPlayers, () => {
    syncFakebinSelection();
});

watch(activeTab, (newTab) => {
    chrome.storage.local.set({popupActiveTab: newTab}, function () {
    });
});

watch(selectedFakebinKey, (newKey) => {
    chrome.storage.local.set({selectedFakebinKey: newKey || null}, function () {
    });
});

/**
 * Generates a Futbin search link for the currently selected player. When no player
 * has been selected yet, the link falls back to the generic player overview page.
 *
 * @type {import('vue').ComputedRef<string>}
 */
const futbinLink = computed(() => {
    const trimmedName = playerName.value ? playerName.value.trim() : '';
    const baseUrl = 'https://www.futbin.com/25/players';

    if (!trimmedName) {
        return baseUrl;
    }

    return `${baseUrl}?page=1&search=${encodeURIComponent(trimmedName)}`;
});

// Log current URL and pathname in the console for debugging purposes
console.log("Current URL:", window.location.href); // Full URL of the current page
console.log("Current Pathname:", window.location.pathname); // Pathname (after the domain)

// Audio elements for success and failure actions
const sniperHeadShotAudio = new Audio('../assets/SniperHeadShot.MP3')
const sniperMissAudio = new Audio('../assets/SniperMiss.MP3')

/**
 * Updates the player name and sends a message to the content script when the player input changes.
 *
 * @param {string} newValue - The new value of the player name.
 */
const onPlayerInputChange = async (newValue) => {
    playerName.value = newValue
    await chrome.storage.local.set({name: newValue}, function () {
    });
    await sendMessageToActiveTab({action: 'inputChange', value: playerName.value});
}

/**
 * Updates the search limit and stores the value in Chrome local storage.
 *
 * @param {number} newValue - The new search limit.
 */
const onSearchLimitChange = (newValue) => {
    searchLimit.value = newValue
    chrome.storage.local.set({searchLimit: newValue}, function () {
    });
}

/**
 * Updates the search purchase limit and stores the value in Chrome local storage.
 *
 * @param {number} newValue - The new search limit.
 */
const onPurchaseLimitChange = (newValue) => {
    purchaseLimit.value = newValue;
    chrome.storage.local.set({purchaseLimit: newValue}, function () {
    });
}

/**
 * Updates the min buy now price, stores it, and sends the updated value to the content script.
 *
 * @param {number} newValue - The new max buy now price.
 */
const onMinBuyNowChange = async (newValue) => {
    minBuyNow.value = newValue;
    chrome.storage.local.set({minBuyNow: newValue}, function () {
    });
    await sendMessageToActiveTab({action: 'minBuyNowChange', value: minBuyNow.value});
}

/**
 * Updates the max buy now price, stores it, and sends the updated value to the content script.
 *
 * @param {number} newValue - The new max buy now price.
 */
const onMaxBuyNowChange = async (newValue) => {
    maxBuyNow.value = newValue;
    chrome.storage.local.set({maxBuyNow: newValue}, function () {
    });
    await sendMessageToActiveTab({action: 'maxBuyNowChange', value: maxBuyNow.value});

    // Updates the profit display based on the calculated profit
    if (maxBuyNow.value && maxListPrice.value) {
        const profitParagraph = profitRef.value
        const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
        profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
    }
}

/**
 * Handles player selection, updates the player name, and sends a message to the content script.
 *
 * @param {string} newValue - The new selected player name.
 */
const onPlayerSelected = async (newValue) => {
    playerName.value = newValue
    await chrome.storage.local.set({name: newValue}, function () {
    });
    await sendMessageToActiveTab({action: 'playerSelected', value: playerName.value});
}

/**
 * Toggles the visibility of advanced settings.
 */
const onAdvancedSettingsPressed = () => {
    advancedSettings.value = !advancedSettings.value;
}

/**
 * Updates the auto-listing checkbox value and stores it in Chrome local storage.
 *
 * @param {boolean} newValue - The new value for the auto-list checkbox.
 */
const onCheckedChanged = (newValue) => {
    autoListChecked.value = newValue
    chrome.storage.local.set({autoListChecked: newValue}, function () {
    });
    setTimeout(() => {
        if (maxBuyNow.value && maxListPrice.value) {
            const profitParagraph = profitRef.value
            const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
            profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
        }
    }, 50)
}

/**
 * Updates the minimum listing price and stores it in Chrome local storage.
 *
 * @param {number} newValue - The new minimum listing price.
 */
const onMinListPriceChange = (newValue) => {
    minListPrice.value = newValue;
    chrome.storage.local.set({minListPrice: newValue}, function () {
    });
}

/**
 * Updates the maximum listing price, recalculates profit, and updates the profit display.
 *
 * @param {number} newValue - The new maximum listing price.
 */
const onMaxListPriceChange = (newValue) => {
    maxListPrice.value = newValue;
    chrome.storage.local.set({maxListPrice: newValue}, function () {
    });
    setTimeout(() => {
        if (maxBuyNow.value && maxListPrice.value) {
            const profitParagraph = profitRef.value
            const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
            profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
        }
    }, 50)
}

/**
 * Clears all input fields and resets default values.
 */
const onClearAllClicked = async () => {
    playerName.value = null;
    searchLimit.value = null;
    purchaseLimit.value = null;
    minBuyNow.value = null;
    maxBuyNow.value = null;
    autoListChecked.value = false;
    minListPrice.value = null;
    maxListPrice.value = null;
    rpm.value = 60;
    sliderKey.value++;

    // Resets chrome local storage
    await chrome.storage.local.set({
        name: null,
        searchLimit: '',
        purchaseLimit: '',
        minBuyNow: null,
        maxBuyNow: null,
        autoListChecked: false,
        minListPrice: null,
        maxListPrice: null,
        rpm: 60
    }, function () {
        console.log('All values have been reset to local storage.');
    });
}

/**
 * Updates the RPM value and sends a message to the content script.
 *
 * @param {number} newValue - The new RPM value.
 */
const onSliderValueChange = async (newValue) => {
    rpm.value = newValue;
    chrome.storage.local.set({rpm: newValue}, function () {
    });
    await sendMessageToActiveTab({action: 'rpmChange', value: rpm.value});
}

/**
 * Updates the search result delay and sends a message to the content script.
 *
 * @param {number} newValue - The new search result delay in milliseconds.
 */
const onSearchResultDelayChange = async (newValue) => {
    searchResultDelay.value = newValue;
    await sendMessageToActiveTab({action: 'searchResultDelay', value: searchResultDelay.value});
}

/**
 * Updates the confirm dialog delay and sends a message to the content script.
 *
 * @param {number} newValue - The new confirm dialog delay in milliseconds.
 */
const onConfirmDialogDelayChange = async (newValue) => {
    confirmDialogDelay.value = newValue;
    await sendMessageToActiveTab({action: 'confirmDialogDelay', value: confirmDialogDelay.value});
}

/**
 * Updates the confirm purchase delay and sends the updated value to the content script.
 *
 * @param {number} newValue - The new confirm purchase delay in milliseconds.
 */
const onCheckPurchaseDelayChange = async (newValue) => {
    confirmPurchaseDelay.value = newValue;
    await sendMessageToActiveTab({action: 'confirmPurchaseDelay', value: confirmDialogDelay.value});
}

/**
 * Calculates profit after EA tax (5% deduction on sales).
 *
 * @param {number} buyPrice - The purchase price of the item.
 * @param {number} listPrice - The selling price of the item.
 * @returns {number} - The profit after the 5% EA tax is deducted.
 */
const eaAfterTax = (buyPrice, listPrice) => {
    const profit = listPrice * 0.95 - buyPrice;
    return Math.round(profit);
};

/**
 * Starts the search process by sending a message to the content script.
 */
const startSearch = async () => {
    running.value = true;
    const result = await sendMessageToActiveTab({
        action: 'startSearch',
        searchLimit: searchLimit.value,
        purchaseLimit: purchaseLimit.value,
        rpm: rpm.value,
        checked: autoListChecked.value,
        minList: minListPrice.value,
        maxList: maxListPrice.value,
        searchResultDelay: searchResultDelay.value,
        confirmDialogDelay: confirmDialogDelay.value,
        confirmPurchaseDelay: confirmPurchaseDelay.value
    });

    if (!result.ok) {
        running.value = false;
        if (result.reason !== 'no-receiver') {
            pushLogEntry('Unable to reach the active tab to start the bot.');
        }
        return;
    }

    logList.value.push(`[${new Date().toLocaleString()}] Bot started`);
    if (canTrackPrice.value) {
        sendTrackPlayerMessage(true).then((response) => {
            if (response.success) {
                requestTrackedPlayers();
            }
        });
    }
}

/**
 * Stops the search process by sending a 'stopSearch' message to the content script.
 */
const stopSearch = async () => {
    running.value = false;
    await sendMessageToActiveTab({action: 'stopSearch'});
}

/**
 * Changes the theme colors by updating the CSS variables and saving the selected theme to Chrome storage.
 *
 * @param {string} primaryColor - The primary theme color.
 * @param {string} secondaryColor - The secondary theme color.
 */
const applyThemeColors = (primaryColor, secondaryColor, persist = false) => {
    if (!primaryColor || !secondaryColor) {
        return;
    }

    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);

    if (persist) {
        chrome.storage.local.set({theme: {primaryColor, secondaryColor}}, function () {
            console.log('Theme colors saved to local storage.');
        });
    }
};

const changeThemeColors = (primaryColor, secondaryColor) => {
    applyThemeColors(primaryColor, secondaryColor, true);
};

/**
 * Fetches theme and search-related settings from Chrome storage and applies them to the UI.
 * This function is triggered when the component is mounted.
 */
onMounted(async () => {
    // Retrieve the 'theme' object from Chrome storage
    chrome.storage.local.get(['theme'], function (result) {
        if (result.theme?.primaryColor && result.theme?.secondaryColor) {
            const {primaryColor, secondaryColor} = result.theme;
            applyThemeColors(primaryColor, secondaryColor);
            console.log('Theme loaded and applied:', primaryColor, secondaryColor);
        } else {
            applyThemeColors(DEFAULT_THEME.primaryColor, DEFAULT_THEME.secondaryColor, true);
            console.log('Default theme applied.');
        }
    });

    // Retrieve various settings from Chrome storage and insert them to the global variables
    await chrome.storage.local.get(['name', 'searchLimit', 'purchaseLimit', 'minBuyNow', 'maxBuyNow', 'autoListChecked', 'minListPrice', 'maxListPrice', 'rpm', 'pricePlatform', 'popupActiveTab', 'selectedFakebinKey'], function (result) {
        playerName.value = result.name || undefined;
        if (result.name) onPlayerSelected(result.name);
        searchLimit.value = result.searchLimit || undefined;
        purchaseLimit.value = result.purchaseLimit || undefined;
        minBuyNow.value = result.minBuyNow || undefined;
        maxBuyNow.value = result.maxBuyNow || undefined;
        onMaxBuyNowChange(result.maxBuyNow)
        autoListChecked.value = result.autoListChecked !== undefined ? result.autoListChecked : false;
        minListPrice.value = result.minListPrice || undefined;
        maxListPrice.value = result.maxListPrice || undefined;
        rpm.value = result.rpm || 60;
        pricePlatform.value = (result.pricePlatform || 'ps').toLowerCase();
        const storedTab = tabs.find((tab) => tab.id === result.popupActiveTab)?.id;
        if (storedTab) {
            activeTab.value = storedTab;
        }
        if (typeof result.selectedFakebinKey === 'string') {
            selectedFakebinKey.value = result.selectedFakebinKey;
        }
        sliderKey.value++;
    });

    requestTrackedPlayers();
});

/**
 * Listens for incoming messages from the content script and handles various actions.
 *
 * @param {Object} request - The message payload.
 * @param {Object} sender - The message sender information.
 * @param {Function} sendResponse - Callback to send a response to the sender.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    /**
     * Handles the 'updateNames' action which updates the UI with the list of player names
     * received from the content script.
     */
    if (request.action === 'updateNames') {

        // Sets the name list array from content script
        nameList.value = request.list;
        sendResponse({success: true, message: 'successful'})
    }

    /**
     * Handles the 'finishedSearch' action which stops the search process by setting the 'running' flag to false
     * and logs the event in the logList.
     */
    else if (request.action === 'finishedSearch') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'reachedSearchLimit' action which stops the search process when the defined search limit is reached.
     * It updates the 'running' flag to false and logs the event in the logList along with the search limit reached.
     */
    else if (request.action === 'reachedSearchLimit') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped by search limit ${searchLimit.value}`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'reachedPurchaseLimit' action which stops the search process when the defined search limit is reached.
     * It updates the 'running' flag to false and logs the event in the logList along with the search limit reached.
     */
    else if (request.action === 'reachedPurchaseLimit') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped by purchased limit ${purchaseLimit.value}`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'searched' action which increments the 'searches' counter whenever a search iteration is completed.
     */
    else if (request.action === 'searched') {
        searches.value++;
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'bought' action which increments the 'buys' counter when a player is successfully purchased,
     * logs the purchase details in the logList, and plays the 'sniperHeadShotAudio' sound.
     */
    else if (request.action === 'bought') {
        buys.value++;
        logList.value.push(`[${new Date().toLocaleString()}] Bought ${request.name} for ${request.price} coins`);
        sniperHeadShotAudio.play();
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'listed' action which logs the details of the listed player (min/max price) in the logList.
     */
    else if (request.action === 'listed') {
        logList.value.push(`[${new Date().toLocaleString()}] Listed ${request.name} for min ${request.minList} and max ${request.maxList} coins`);

    }

    /**
     * Handles the 'failed' action which increments the 'fails' counter when an attempt to purchase a player fails,
     * logs the failure details in the logList, and plays the 'sniperMissAudio' sound.
     */
    else if (request.action === 'failed') {
        fails.value++;
        logList.value.push(`[${new Date().toLocaleString()}] Failed to buy ${request.name} for ${request.price} coins`);
        sniperMissAudio.play();
        sendResponse({success: true, message: 'successful'})
    }
    else if (request.action === 'futbinTrackedPlayersUpdated') {
        trackedPlayers.value = request.players || [];
        if (request.lastRefresh) {
            lastPriceRefresh.value = request.lastRefresh;
        }
        syncFakebinSelection();
    }
    else if (request.action === 'futbinPriceAlert') {
        const alert = request.alert || {};
        const player = alert.player;
        const change = alert.change;
        if (player && change) {
            const directionText = change.direction === 'increase' ? 'increased' : change.direction === 'decrease' ? 'decreased' : 'changed';
            const platformLabel = player.platform ? player.platform.toUpperCase() : 'PS';
            const timestampText = formatTimestamp(change.timestamp);
            const priceText = `${formatCoins(change.newPrice)} coins`;
            const percentText = Number.isFinite(change.percent) ? `${change.percent > 0 ? '+' : ''}${change.percent.toFixed(2)}%` : '';
            logList.value.push(`[${timestampText}] ${player.name} (${platformLabel}) ${directionText} to ${priceText}${percentText ? ` (${percentText})` : ''}`);
        }
        requestTrackedPlayers();
    }
});

</script>

<template>
    <div class="popup-wrapper">
        <div class="popup-container">
            <h1 class="title">PlayerHeadShot</h1>
            <nav class="tab-bar" role="tablist">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    type="button"
                    class="tab-button"
                    :class="{'tab-button--active': tab.id === activeTab}"
                    @click="setActiveTab(tab.id)"
                >
                    {{ tab.label }}
                </button>
            </nav>

            <section v-show="activeTab === 'autobuyer'" class="tab-panel tab-panel--autobuyer">
                <div class="input-container">
                    <PlayerInput input-id="player-input"
                                 label="Player Name"
                                 v-model="playerName"
                                 placeholder="Search for a player"
                                 :playerList="nameList"
                                 :disabled="running"
                                 @inputChangeEvent="onPlayerInputChange"
                                 @selectedPlayerEvent="onPlayerSelected"
                    >
                    </PlayerInput>
                    <div class="custom-button-container">
                        <CustomInput input-id="search-limit-input"
                                     label="Search Limit"
                                     v-model="searchLimit"
                                     :disabled="running"
                                     :max="15000000"
                                     :min="0"
                                     @inputChangeEvent="onSearchLimitChange"
                                     placeholder="No limit">
                        </CustomInput>
                        <CustomInput input-id="purchase-limit-input"
                                     label="Purchase limit"
                                     v-model="purchaseLimit"
                                     :disabled="running"
                                     :max="100"
                                     :min="0"
                                     @inputChangeEvent="onPurchaseLimitChange"
                                     placeholder="No limit"
                        ></CustomInput>
                    </div>
                    <div class="custom-button-container">
                        <CustomInput id="min-buy-now-input"
                                     input-id="min-buy-now-input"
                                     label="Min Buy Now"
                                     v-model="minBuyNow"
                                     :disabled="running"
                                     :max="15000000"
                                     :min="0"
                                     @inputChangeEvent="onMinBuyNowChange"
                                     placeholder="Any">
                        </CustomInput>
                        <CustomInput id="max-buy-now-input"
                                     input-id="max-buy-now-input"
                                     label="Max Buy Now"
                                     v-model="maxBuyNow"
                                     :disabled="running"
                                     :max="15000000"
                                     :min="0"
                                     @inputChangeEvent="onMaxBuyNowChange"
                                     placeholder="Any">
                        </CustomInput>
                    </div>
                    <AutoListCheckBox @checkChangedEvent="onCheckedChanged" :checked="autoListChecked"></AutoListCheckBox>
                    <div v-if="autoListChecked" class="custom-button-container">
                        <CustomInput input-id="min-list-price-input"
                                     label="Min list price"
                                     :disabled="running"
                                     v-model="minListPrice"
                                     @inputChangeEvent="onMinListPriceChange"
                                     :max="15000000"
                                     :min="0"
                                     placeholder="Min list price">
                        </CustomInput>
                        <CustomInput input-id="max-list-price-input"
                                     label="Max list price"
                                     :disabled="running"
                                     v-model="maxListPrice"
                                     @inputChangeEvent="onMaxListPriceChange"
                                     :max="15000000"
                                     :min="0"
                                     placeholder="Max list price">
                        </CustomInput>
                    </div>
                    <label v-if="autoListChecked && maxBuyNow && maxListPrice" class="net-label">
                        Profit: <p ref="profitRef" class="profit-p">{{ eaAfterTax(maxBuyNow, maxListPrice) }}</p>
                    </label>
                    <div class="utility-buttons">
                        <CustomButton button-id="clear-all"
                                      class="clear-all-button"
                                      text="Clear All"
                                      :disabled="running"
                                      @click="onClearAllClicked"
                        ></CustomButton>
                        <a :href="futbinLink"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="futbin-link"
                           :class="{'futbin-link--disabled': !playerName || !playerName.trim()}"
                        >
                            Futbin
                        </a>
                    </div>
                </div>

                <label @click="onAdvancedSettingsPressed" class="advanced-settings-label">{{
                        "Advanced settings \u2699"
                    }}</label>
                <div v-if="advancedSettings" class="advanced-settings-container">
                    <h2>Delay</h2>
                    <hr>
                    <div class="advanced-label-container">
                        <label class="advanced-label description">If you are experiencing that the bot fails to purchase sometimes,
                            or gets stuck, try to increase these delay metrics: </label>
                    </div>
                    <div class="advanced">
                        <CustomInput input-id="wait-search-results-input"
                                     :disabled="!advancedSettings"
                                     v-model="searchResultDelay"
                                     @inputChangeEvent="onSearchResultDelayChange"
                                     :max="1000"
                                     :min="0"
                                     placeholder="Default 250 ms"
                        ></CustomInput>
                        <label class="advanced-label">Delay time for search results (milliseconds)</label>
                    </div>
                    <div class="advanced">
                        <CustomInput input-id="wait-confirm-dialog-input"
                                     :disabled="!advancedSettings"
                                     v-model="confirmDialogDelay"
                                     @inputChangeEvent="onConfirmDialogDelayChange"
                                     :max="1000"
                                     :min="0"
                                     placeholder="Default 80 ms"
                        ></CustomInput>
                        <label class="advanced-label">Delay time for confirm dialog (milliseconds)</label>
                    </div>
                    <div class="advanced">
                        <CustomInput input-id="wait-confirm-purchase-input"
                                     :disabled="!advancedSettings"
                                     v-model="confirmPurchaseDelay"
                                     @inputChangeEvent="onCheckPurchaseDelayChange"
                                     :max="1000"
                                     :min="0"
                                     placeholder="Default 800 ms"
                        ></CustomInput>
                        <label class="advanced-label">Delay time for purchase confirmation (milliseconds)</label>
                    </div>
                    <h2>Theme Color</h2>
                    <hr>
                    <div class="theme-color-container">
                        <ThemeColorButton primary-color="#3091ae" secondary-color="#5b51ae"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#EF4765" secondary-color="#FF9A5A"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#3bff72" secondary-color="#81eee0"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#1628e5" secondary-color="#30ffe2"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#e875d1" secondary-color="#004aff"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#f82b2b" secondary-color="#d338f6"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#ffc01e" secondary-color="#f59393"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#8f3bcb" secondary-color="#42d73e"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#e00f3e" secondary-color="#efeb3a"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#1abc9c" secondary-color="#16a085"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#ff7f50" secondary-color="#ff4500"
                                          @themeColorChange="changeThemeColors"/>
                        <ThemeColorButton primary-color="#6a5acd" secondary-color="#20b2aa"
                                          @themeColorChange="changeThemeColors"/>
                    </div>
                </div>

                <CustomSlider :key="sliderKey" @sliderValueChange="onSliderValueChange" :rpm="rpm"></CustomSlider>

                <div class="button-container">
                    <CustomButton button-id="stop-button"
                                  text="Stop"
                                  @click="stopSearch"
                                  :disabled="!running"
                    >
                    </CustomButton>
                    <CustomButton button-id="Search-button"
                                  text="Search"
                                  @click="startSearch"
                                  :disabled="running"
                    >
                    </CustomButton>
                </div>
                <SnipingResults :fails="fails" :buys="buys" :searches="searches"></SnipingResults>
                <CustomLog :logList="logList"></CustomLog>
                <label class="credit-label">Made by:
                    <a href="https://github.com/jenscaa" target="_blank">jenscaa</a>
                </label>
            </section>

            <section v-if="activeTab === 'watchlist'" class="tab-panel tab-panel--scrollable">
                <div class="price-tracker-controls">
                    <label class="price-tracker-controls__label" for="price-platform-select">
                        Platform
                        <select id="price-platform-select"
                                v-model="pricePlatform"
                                :disabled="priceTrackerLoading"
                                class="price-tracker-controls__select"
                        >
                            <option value="ps">PlayStation</option>
                            <option value="pc">PC</option>
                            <option value="xbox">Xbox</option>
                        </select>
                    </label>
                    <CustomButton button-id="track-player"
                                  text="Track Futbin Price"
                                  :disabled="!canTrackPrice || priceTrackerLoading"
                                  @click="trackFutbinPrice"/>
                    <CustomButton button-id="refresh-prices"
                                  text="Refresh Watchlist"
                                  :disabled="priceTrackerLoading"
                                  @click="manualRefreshTrackedPlayers"/>
                </div>
                <div class="price-tracker">
                    <div class="price-tracker__header">
                        <h2>Futbin Watchlist</h2>
                        <p class="price-tracker__meta">Last refresh: {{ formattedLastRefresh }} · Next: {{ formattedNextRefresh }}</p>
                    </div>
                    <template v-if="trackedPlayers.length">
                        <ul class="price-tracker__list">
                            <li v-for="player in trackedPlayers" :key="player.storageKey" class="price-tracker__item">
                                <div class="price-tracker__info">
                                    <span class="price-tracker__name">{{ player.name }}</span>
                                    <span class="price-tracker__details">
                                        {{ (player.platform || 'ps').toUpperCase() }}
                                        <template v-if="player.rating"> · {{ player.rating }} OVR</template>
                                        <template v-if="player.revision"> · {{ player.revision }}</template>
                                    </span>
                                    <span class="price-tracker__updated">Updated {{ formatTimestamp(player.lastUpdated) }}</span>
                                </div>
                                <div class="price-tracker__pricing">
                                    <span class="price-tracker__value">{{ formatCoins(player.lastPrice) }} coins</span>
                                    <span class="price-tracker__change"
                                          :class="{
                                              'price-tracker__change--positive': player.lastChange?.direction === 'increase',
                                              'price-tracker__change--negative': player.lastChange?.direction === 'decrease'
                                          }"
                                    >
                                        {{ formatChange(player.lastChange) }}
                                    </span>
                                </div>
                                <button class="price-tracker__remove"
                                        :disabled="priceTrackerLoading"
                                        @click="removeTrackedPlayer(player)"
                                >
                                    Remove
                                </button>
                            </li>
                        </ul>
                    </template>
                    <p v-else class="price-tracker__empty">Track a player to monitor price swings every five minutes.</p>
                </div>
            </section>

            <section v-if="activeTab === 'fakebins'" class="tab-panel tab-panel--scrollable">
                <div class="fakebin-intro">
                    <p>Use live Futbin prices as fakebins for quick autobuyer setup. Toggle any tracked player and drop their price into your buy and list fields instantly.</p>
                </div>

                <div v-if="trackedPlayers.length" class="fakebin-layout">
                    <div class="fakebin-watchlist">
                        <h2>Fakebin Watchlist</h2>
                        <p class="fakebin-watchlist__hint">Mark tracked players as fakebins to reuse their Futbin price in the autobuyer.</p>
                        <ul class="fakebin-list">
                            <li v-for="player in trackedPlayers"
                                :key="player.storageKey"
                                class="fakebin-list__item">
                                <div class="fakebin-list__summary">
                                    <div class="fakebin-list__details">
                                        <span class="fakebin-list__name">{{ player.name }}</span>
                                        <span class="fakebin-list__meta">
                                            {{ (player.platform || 'ps').toUpperCase() }}
                                            <template v-if="player.rating"> · {{ player.rating }} OVR</template>
                                            <template v-if="player.revision"> · {{ player.revision }}</template>
                                        </span>
                                    </div>
                                    <button type="button"
                                            class="fakebin-toggle"
                                            :class="{'fakebin-toggle--active': player.fakebin?.active}"
                                            :disabled="priceTrackerLoading"
                                            @click="toggleFakebin(player)">
                                        {{ player.fakebin?.active ? 'Fakebin active' : 'Mark Fakebin' }}
                                    </button>
                                </div>
                                <div class="fakebin-list__meta-row">
                                    <div class="fakebin-list__price-block">
                                        <span class="fakebin-list__label">Futbin price</span>
                                        <span class="fakebin-list__value">{{ formatCoins(player.fakebin?.lastAppliedPrice || player.lastPrice) }} coins</span>
                                        <span class="fakebin-list__updated">Updated {{ formatTimestamp(player.fakebin?.updated || player.lastUpdated) }}</span>
                                    </div>
                                    <button type="button"
                                            class="fakebin-select"
                                            :class="{'fakebin-select--active': selectedFakebin && selectedFakebin.storageKey === player.storageKey}"
                                            :disabled="!player.fakebin?.active"
                                            @click="selectFakebin(player)">
                                        {{ selectedFakebin && selectedFakebin.storageKey === player.storageKey ? 'Selected' : 'Select' }}
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="fakebin-selected" v-if="selectedFakebin">
                        <h2>Selected Fakebin</h2>
                        <p class="fakebin-selected__name">{{ selectedFakebin.name }}</p>
                        <p class="fakebin-selected__meta">
                            {{ (selectedFakebin.platform || 'ps').toUpperCase() }}
                            <template v-if="selectedFakebin.rating"> · {{ selectedFakebin.rating }} OVR</template>
                            <template v-if="selectedFakebin.revision"> · {{ selectedFakebin.revision }}</template>
                        </p>
                        <p class="fakebin-selected__price">
                            Futbin price · {{ formatCoins(selectedFakebin.fakebin?.lastAppliedPrice || selectedFakebin.lastPrice) }} coins
                        </p>
                        <CustomButton button-id="apply-fakebin"
                                      class="fakebin-selected__apply"
                                      text="Use in Autobuyer"
                                      :disabled="priceTrackerLoading"
                                      @click="applyFakebinToAutobuyer"/>
                    </div>
                    <div class="fakebin-selected fakebin-selected--empty" v-else>
                        <p>Select a fakebin to load its price into the autobuyer.</p>
                    </div>
                </div>
                <p v-else class="fakebin-empty">Track a Futbin player first to create fakebins you can reuse here.</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
:root {
    --primary-color: #3091ae;
    --secondary-color: #5b51ae;
}

.title {
    text-align: center;
    align-self: center;
    justify-content: center;
    color: white;
    margin: 0;
    padding: 20px;
}

.popup-wrapper {
    font-family: Arial, sans-serif;
    background: rgba(0, 0, 0, 0.3);
    min-width: 380px;
}

.popup-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 16px;
}

.tab-bar {
    display: flex;
    gap: 8px;
    padding: 0 18px;
}

.tab-button {
    flex: 1;
    border: none;
    border-radius: 18px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background 150ms ease-in-out, transform 150ms ease-in-out, box-shadow 150ms ease-in-out;
}

.tab-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.tab-button--active {
    background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
    transform: translateY(-1px);
}

.tab-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.tab-panel--autobuyer {
    gap: 22px;
}

.tab-panel--scrollable {
    max-height: 520px;
    overflow-y: auto;
    padding-right: 6px;
}

.tab-panel--scrollable::-webkit-scrollbar {
    width: 6px;
}

.tab-panel--scrollable::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
}

.input-container, .advanced-settings-container {
    display: grid;
    grid-template-rows: auto;
    gap: 15px;
    align-items: center;
}

.advanced-settings-label {
    justify-self: center;
    justify-content: center;
    text-align: center;
    color: white;
    font-weight: bold;
    padding: 5px;
    cursor: pointer;
    transition: transform 150ms ease-in-out;
}

.advanced-settings-label:hover {
    transform: scale(1.05);
}

.advanced-label-container {
    justify-content: center;
    align-content: center;
    padding: 0 36px;
}

.advanced {
    justify-self: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    padding: 0 18px;
}

.advanced-label {
    color: white;
    align-self: center;
    font-weight: bold;
    text-align: start;
}

.advanced-settings-container h2 {
    margin: 0;
    padding-top: 5px;
    padding-left: 10%;
    color: white;
}

.advanced-settings-container hr {
    justify-self: center;
    margin: 0;
    padding: 0;
    width: 80%;
}

.theme-color-container {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    padding: 0 10%;
}

.net-label {
    color: white;
    font-weight: bold;
    text-align: center;
}

.profit-p {
    color: white;
    display: inline;
    margin: 0;
    padding: 0;
    width: fit-content;
    height: fit-content;
}

.custom-button-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    padding: 0 18px;
}

.button-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 0 18px 4px 18px;
}

.clear-all-button {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 32px;
}

.utility-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    gap: 15px;
    padding: 0 18px;
    margin-top: 10px;
}

.utility-buttons :deep(.btn) {
    width: 100%;
}

.futbin-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 32px;
    background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
    border-radius: 20px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    transition: transform 150ms ease-in-out, box-shadow 150ms ease-in-out;
}

.futbin-link:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.futbin-link--disabled {
    opacity: 0.5;
    pointer-events: none;
    box-shadow: none;
    transform: none;
}

.credit-label {
    color: white;
    justify-self: center;
    justify-content: center;
    text-align: center;
    margin: 15px 0 5px 0;
    font-weight: bold;
}

.credit-label a {
    color: var(--secondary-color);
}

.price-tracker-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    align-items: center;
    padding: 0 18px;
    margin-top: 4px;
}

.price-tracker-controls__label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: white;
    font-weight: bold;
    font-size: 12px;
}

.price-tracker-controls__select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.4);
    color: white;
    font-weight: bold;
}

.price-tracker-controls__select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.price-tracker-controls :deep(.btn) {
    width: 100%;
}

.price-tracker {
    background: rgba(0, 0, 0, 0.35);
    border-radius: 16px;
    padding: 16px 18px;
    margin: 0 18px 12px 18px;
    display: grid;
    gap: 12px;
    color: white;
}

.price-tracker__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
}

.price-tracker__header h2 {
    margin: 0;
    font-size: 16px;
}

.price-tracker__meta {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.price-tracker__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 12px;
}

.price-tracker__item {
    display: grid;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 12px;
}

.price-tracker__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.price-tracker__name {
    font-weight: bold;
    font-size: 15px;
}

.price-tracker__details {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
}

.price-tracker__updated {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
}

.price-tracker__pricing {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.price-tracker__value {
    font-weight: bold;
    font-size: 14px;
}

.price-tracker__change {
    font-size: 12px;
    font-weight: bold;
    border-radius: 12px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.12);
}

.price-tracker__change--positive {
    color: #3cff9c;
}

.price-tracker__change--negative {
    color: #ff6b6b;
}

.price-tracker__remove {
    justify-self: start;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
    border-radius: 20px;
    padding: 6px 12px;
    font-weight: bold;
    cursor: pointer;
    transition: background 150ms ease-in-out, color 150ms ease-in-out;
}

.price-tracker__remove:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
}

.price-tracker__remove:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.price-tracker__empty {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
}

.fakebin-intro {
    margin: 0 18px;
    padding: 12px 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
}

.fakebin-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 16px;
    padding: 0 18px 18px 18px;
}

.fakebin-watchlist {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.fakebin-watchlist h2 {
    margin: 0;
    color: white;
}

.fakebin-watchlist__hint {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.fakebin-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 12px;
}

.fakebin-list__item {
    background: rgba(0, 0, 0, 0.35);
    border-radius: 14px;
    padding: 14px;
    display: grid;
    gap: 10px;
    color: white;
}

.fakebin-list__summary {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.fakebin-list__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.fakebin-list__name {
    font-weight: 600;
    font-size: 15px;
}

.fakebin-list__meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.fakebin-list__meta-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.fakebin-list__price-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.fakebin-list__label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.6);
}

.fakebin-list__value {
    font-weight: bold;
    font-size: 14px;
}

.fakebin-list__updated {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
}

.fakebin-toggle,
.fakebin-select {
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 18px;
    padding: 6px 14px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    background: transparent;
    cursor: pointer;
    transition: background 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out;
}

.fakebin-toggle--active {
    background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
    border-color: transparent;
}

.fakebin-select--active {
    background: rgba(255, 255, 255, 0.18);
}

.fakebin-toggle:disabled,
.fakebin-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.fakebin-selected {
    background: rgba(0, 0, 0, 0.45);
    border-radius: 16px;
    padding: 16px;
    display: grid;
    gap: 8px;
    color: white;
}

.fakebin-selected h2 {
    margin: 0;
}

.fakebin-selected__name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.fakebin-selected__meta {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.fakebin-selected__price {
    margin: 0;
    font-weight: bold;
}

.fakebin-selected__apply :deep(.btn) {
    width: 100%;
}

.fakebin-selected--empty {
    align-items: center;
    justify-content: center;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
}

.fakebin-empty {
    margin: 0 18px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.45);
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

@media (max-width: 420px) {
    .popup-wrapper {
        min-width: auto;
    }

    .fakebin-layout {
        grid-template-columns: 1fr;
    }

    .theme-color-container {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .price-tracker-controls {
        grid-template-columns: 1fr;
    }

    .custom-button-container {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}
</style>
