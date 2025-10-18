(function () {
    const FUTBIN_BASE_URL = 'https://www.futbin.com/25/players';

    function buildContainer(clearButton) {
        const container = document.createElement('div');
        container.className = 'utility-buttons';
        clearButton.parentNode.insertBefore(container, clearButton);
        container.appendChild(clearButton);
        return container;
    }

    function createAnchor(container) {
        const anchor = document.createElement('a');
        anchor.className = 'futbin-link futbin-link--disabled';
        anchor.textContent = 'Futbin';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.href = FUTBIN_BASE_URL;
        container.appendChild(anchor);
        return anchor;
    }

    function updateAnchor(anchor, value) {
        const trimmed = value ? value.trim() : '';
        if (!trimmed) {
            anchor.href = FUTBIN_BASE_URL;
            anchor.classList.add('futbin-link--disabled');
            return;
        }
        anchor.href = `${FUTBIN_BASE_URL}?page=1&search=${encodeURIComponent(trimmed)}`;
        anchor.classList.remove('futbin-link--disabled');
    }

    function trySetup() {
        const clearButton = document.getElementById('clear-all');
        const playerInput = document.getElementById('player-input');
        if (!clearButton || !playerInput) {
            return false;
        }

        if (clearButton.parentElement && clearButton.parentElement.classList.contains('utility-buttons')) {
            return true;
        }

        const container = buildContainer(clearButton);
        const anchor = createAnchor(container);

        let previousValue = undefined;
        const refresh = () => {
            const currentValue = playerInput.value;
            if (currentValue === previousValue) {
                return;
            }
            previousValue = currentValue;
            updateAnchor(anchor, currentValue);
        };

        refresh();
        playerInput.addEventListener('input', refresh);
        playerInput.addEventListener('change', refresh);
        const intervalId = window.setInterval(refresh, 500);

        const cleanupObserver = new MutationObserver(() => {
            if (!document.body.contains(playerInput)) {
                window.clearInterval(intervalId);
                cleanupObserver.disconnect();
            }
        });
        cleanupObserver.observe(document.body, { childList: true, subtree: true });

        return true;
    }

    function bootstrap() {
        if (trySetup()) {
            observer.disconnect();
        }
    }

    const observer = new MutationObserver(bootstrap);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        bootstrap();
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    }
})();
