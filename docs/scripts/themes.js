/**
 * THEMES.JS - Theme switching functionality
 * Handles switching between meadow and rainy themes with localStorage persistence
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'emily-theme';
    const THEMES = ['meadow', 'rainy'];
    const DEFAULT_THEME = 'meadow';

    /**
     * Get the current theme from localStorage or default
     */
    function getCurrentTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(stored) ? stored : DEFAULT_THEME;
    }

    /**
     * Apply a theme to the document
     * @param {string} themeName - 'meadow' or 'rainy'
     */
    function setTheme(themeName) {
        if (!THEMES.includes(themeName)) {
            console.warn(`Unknown theme: ${themeName}`);
            return false;
        }

        const html = document.documentElement;

        // Remove all theme classes
        THEMES.forEach(t => {
            html.classList.remove(`theme-${t}`);
        });

        // Add the new theme class (meadow is default, no class needed)
        if (themeName !== 'meadow') {
            html.classList.add(`theme-${themeName}`);
        }

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, themeName);

        return true;
    }

    /**
     * Toggle to the next theme
     */
    function toggleTheme() {
        const current = getCurrentTheme();
        const currentIndex = THEMES.indexOf(current);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        setTheme(THEMES[nextIndex]);
        return THEMES[nextIndex];
    }

    /**
     * Get list of available themes
     */
    function getThemes() {
        return [...THEMES];
    }

    // Apply saved theme on load
    function init() {
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for terminal commands
    window.themeManager = {
        setTheme,
        getCurrentTheme,
        toggleTheme,
        getThemes
    };

})();
