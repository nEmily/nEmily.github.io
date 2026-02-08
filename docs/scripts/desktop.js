/**
 * DESKTOP.JS - Desktop icons and terminal lifecycle
 * Handles showing/hiding desktop icons and reopening the terminal
 */

(function() {
    'use strict';

    const desktopIcons = document.getElementById('desktop-icons');
    const terminalIcon = document.getElementById('icon-terminal');
    const windowFrame = document.getElementById('window-frame');
    const restoreBtn = document.getElementById('restore-btn');

    /**
     * Show desktop icons (when terminal is closed)
     */
    function showDesktop() {
        desktopIcons.classList.add('visible');
    }

    /**
     * Hide desktop icons (when terminal is open)
     */
    function hideDesktop() {
        desktopIcons.classList.remove('visible');
    }

    /**
     * Open a fresh terminal instance
     */
    function openTerminal() {
        hideDesktop();

        // Show the window
        windowFrame.classList.remove('hidden', 'minimized');

        // Reset window position if it was dragged
        windowFrame.style.position = '';
        windowFrame.style.left = '';
        windowFrame.style.top = '';
        windowFrame.style.margin = '';

        // Ensure there's at least one tab - create home tab if none exist
        const existingTabs = document.querySelectorAll('.tab[data-tab]');
        if (existingTabs.length === 0) {
            // Recreate the home tab
            if (window.tabManager && window.tabManager.createHomeTab) {
                window.tabManager.createHomeTab();
            } else {
                // Fallback: create a basic terminal tab
                if (window.tabManager && window.tabManager.createTab) {
                    window.tabManager.createTab();
                }
            }
        }

        // Focus the terminal input
        setTimeout(() => {
            const activeTerminal = document.querySelector('.tab-content.active');
            const inputEl = activeTerminal?.querySelector('.input-text');
            if (inputEl) inputEl.focus();
        }, 100);
    }

    // Double-click terminal icon to open
    terminalIcon.addEventListener('dblclick', openTerminal);

    // Single click selects (visual feedback only for now)
    terminalIcon.addEventListener('click', (e) => {
        // Deselect others
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
        terminalIcon.classList.add('selected');
    });

    // Click on desktop background deselects icons
    document.querySelector('.backdrop').addEventListener('click', () => {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    });

    // Expose functions for other scripts
    window.desktopManager = {
        showDesktop,
        hideDesktop,
        openTerminal
    };

})();
