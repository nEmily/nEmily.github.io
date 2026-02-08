/**
 * TABS.JS - Tab management for the terminal
 * Handles tab switching, keyboard shortcuts, dynamic tab creation/closing
 */

(function() {
    'use strict';

    // DOM Elements
    const tabBar = document.querySelector('.tab-bar');
    const terminal = document.querySelector('.terminal');
    const windowTitle = document.getElementById('window-title');
    const addTabBtn = document.querySelector('.tab-add');

    // Directory paths for each tab (for terminal-style navigation)
    const tabPaths = {
        'home': '~',
        'projects': '~/projects',
        'games': '~/games',
        'contact': '~'
    };

    // Counter for new terminal tabs
    let terminalCounter = 0;

    // Tab name mapping for window title
    const tabTitles = {
        'home': 'emily — home',
        'projects': 'emily — projects',
        'games': 'emily — games',
        'contact': 'emily — contact'
    };

    /**
     * Switch to a specific tab
     * @param {string} tabId - The tab identifier
     */
    function switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab[data-tab]').forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === `tab-${tabId}`;
            content.classList.toggle('active', isActive);
        });

        // Update window title
        const title = tabTitles[tabId] || `emily — ${tabId}`;
        if (windowTitle) {
            windowTitle.textContent = title;
        }

        // Update browser title
        document.title = `~/${tabId === 'home' ? 'emilynguyen' : tabId}`;

        // Focus the input in the new tab
        setTimeout(() => {
            const activeTerminal = document.querySelector('.tab-content.active');
            const inputEl = activeTerminal?.querySelector('.input-text');
            if (inputEl) inputEl.focus();
        }, 50);
    }

    /**
     * Get array of tab IDs in order
     */
    function getTabOrder() {
        return Array.from(document.querySelectorAll('.tab[data-tab]')).map(tab => tab.dataset.tab);
    }

    /**
     * Get currently active tab ID
     */
    function getActiveTab() {
        const activeTab = document.querySelector('.tab.active');
        return activeTab ? activeTab.dataset.tab : 'home';
    }

    /**
     * Switch to next tab
     */
    function nextTab() {
        const order = getTabOrder();
        const current = getActiveTab();
        const currentIndex = order.indexOf(current);
        const nextIndex = (currentIndex + 1) % order.length;
        switchTab(order[nextIndex]);
    }

    /**
     * Switch to previous tab
     */
    function prevTab() {
        const order = getTabOrder();
        const current = getActiveTab();
        const currentIndex = order.indexOf(current);
        const prevIndex = (currentIndex - 1 + order.length) % order.length;
        switchTab(order[prevIndex]);
    }

    /**
     * Create a new terminal tab
     */
    function createTab() {
        terminalCounter++;
        const tabId = `term-${terminalCounter}`;

        // Create tab button
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab';
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('aria-selected', 'false');
        tabBtn.dataset.tab = tabId;
        tabBtn.innerHTML = `
            <span class="tab-label">~/term-${terminalCounter}</span>
            <span class="tab-close" aria-label="Close tab">×</span>
        `;

        // Insert before the + button
        tabBar.insertBefore(tabBtn, addTabBtn);

        // Create tab content
        const tabContent = document.createElement('section');
        tabContent.id = `tab-${tabId}`;
        tabContent.className = 'tab-content';
        tabContent.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">></span>
                <span class="command">echo "new terminal session"</span>
            </div>
            <div class="output">new terminal session</div>
            <div class="terminal-line input-line">
                <span class="prompt">></span>
                <span class="input-text" contenteditable="true" spellcheck="false"></span>
                <span class="cursor"></span>
            </div>
        `;

        terminal.appendChild(tabContent);

        // Initialize terminal input for the new tab
        if (window.initTerminalInput) {
            window.initTerminalInput(tabContent);
        }

        // Switch to the new tab
        switchTab(tabId);

        return tabId;
    }

    /**
     * Close a tab
     * @param {string} tabId - The tab to close
     */
    function closeTab(tabId) {
        const order = getTabOrder();
        const tabBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
        const tabContent = document.getElementById(`tab-${tabId}`);
        const wasActive = tabBtn?.classList.contains('active');
        const tabIndex = order.indexOf(tabId);

        // Remove elements
        if (tabBtn) tabBtn.remove();
        if (tabContent) tabContent.remove();

        const newOrder = getTabOrder();

        // If no tabs left, close the window and show desktop
        if (newOrder.length === 0) {
            closeWindow();
            return;
        }

        // If the closed tab was active, switch to adjacent tab
        if (wasActive) {
            // Prefer the tab to the left, or the first tab if we closed the leftmost
            const newIndex = Math.min(tabIndex, newOrder.length - 1);
            if (newOrder[newIndex]) {
                switchTab(newOrder[newIndex]);
            }
        }
    }

    /**
     * Close the terminal window and show desktop
     */
    function closeWindow() {
        const windowFrame = document.getElementById('window-frame');
        windowFrame.classList.add('hidden');

        // Show desktop icons (with fallback if desktopManager not ready)
        if (window.desktopManager && window.desktopManager.showDesktop) {
            window.desktopManager.showDesktop();
        } else {
            // Fallback: directly show desktop icons
            const desktopIcons = document.getElementById('desktop-icons');
            if (desktopIcons) {
                desktopIcons.classList.add('visible');
            }
        }
    }

    /**
     * Create the home tab (used when reopening terminal)
     */
    function createHomeTab() {
        const tabId = 'home';

        // Check if home tab already exists
        if (document.querySelector('.tab[data-tab="home"]')) {
            switchTab('home');
            return;
        }

        // Create tab button
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab';
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('aria-selected', 'false');
        tabBtn.dataset.tab = tabId;
        tabBtn.innerHTML = `
            <span class="tab-label">~/home</span>
            <span class="tab-close" aria-label="Close tab">×</span>
        `;

        // Insert before the + button
        tabBar.insertBefore(tabBtn, addTabBtn);

        // Create tab content with welcome message
        const tabContent = document.createElement('section');
        tabContent.id = `tab-${tabId}`;
        tabContent.className = 'tab-content';
        tabContent.innerHTML = `
            <pre class="ascii-art" aria-label="Emily Nguyen - software engineer, game dev, educator">   ╭─────────────────────────────────────────────────────╮
   │  software engineer  ·  game dev  ·  educator       │
   ╰─────────────────────────────────────────────────────╯</pre>

            <div class="terminal-line">
                <span class="prompt">></span>
                <span class="command">cat about.txt</span>
            </div>
            <div class="output">
                <span class="comment"># hello world</span><br><br>
                I'm <span class="highlight">Emily Nguyen</span>, a UC Berkeley CS grad with 5+ years<br>
                building robust frameworks and tooling. Currently at Meta<br>
                working on test infrastructure for Reality Labs wearables.<br><br>
                I love making tools that help developers ship faster.
            </div>

            <div class="terminal-line input-line">
                <span class="prompt">></span>
                <span class="input-text" contenteditable="true" spellcheck="false"></span>
                <span class="cursor"></span>
            </div>
        `;

        terminal.appendChild(tabContent);

        // Initialize terminal input
        if (window.initTerminalInput) {
            window.initTerminalInput(tabContent);
        }

        // Switch to home tab
        switchTab(tabId);
    }

    // Event Listeners

    // Click on tabs (handles both switching and closing)
    tabBar.addEventListener('click', (e) => {
        // Handle close button click
        const closeBtn = e.target.closest('.tab-close');
        if (closeBtn) {
            e.stopPropagation();
            const tab = closeBtn.closest('.tab[data-tab]');
            if (tab) {
                closeTab(tab.dataset.tab);
            }
            return;
        }

        // Handle tab switch
        const tab = e.target.closest('.tab[data-tab]');
        if (tab) {
            switchTab(tab.dataset.tab);
        }

        // Handle add button click
        if (e.target.closest('.tab-add')) {
            createTab();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? e.metaKey : e.ctrlKey;

        // Cmd/Ctrl + ] or Ctrl+Tab = next tab
        if ((modKey && e.key === ']') || (e.ctrlKey && e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            nextTab();
        }

        // Cmd/Ctrl + [ or Ctrl+Shift+Tab = prev tab
        if ((modKey && e.key === '[') || (e.ctrlKey && e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            prevTab();
        }

        // Cmd/Ctrl + 1-9 = jump to tab
        if (modKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const order = getTabOrder();
            const index = parseInt(e.key) - 1;
            if (order[index]) {
                switchTab(order[index]);
            }
        }

        // Cmd/Ctrl + T = new tab
        if (modKey && e.key === 't') {
            e.preventDefault();
            createTab();
        }

        // Cmd/Ctrl + Shift + W = close current tab (Cmd+W is reserved by browser)
        if (modKey && e.shiftKey && e.key === 'w') {
            e.preventDefault();
            closeTab(getActiveTab());
        }

        // Also support just 'x' key when not typing to close tab
        if (e.key === 'x' && !e.target.closest('.input-text') && !e.target.closest('input')) {
            e.preventDefault();
            closeTab(getActiveTab());
        }
    });

    // Handle URL hash navigation
    function handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash && getTabOrder().includes(hash)) {
            switchTab(hash);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    // Initialize from URL hash if present
    handleHashChange();

    // Expose tab manager API for other scripts
    window.tabManager = {
        createTab,
        createHomeTab,
        closeTab,
        switchTab,
        getActiveTab,
        getTabOrder
    };

})();
