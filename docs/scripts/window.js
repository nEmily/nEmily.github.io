/**
 * WINDOW.JS - Window controls (close, minimize, maximize, restore, drag)
 */

(function() {
    'use strict';

    const windowFrame = document.getElementById('window-frame');
    const restoreBtn = document.getElementById('restore-btn');
    const btnClose = document.getElementById('btn-close');
    const btnMinimize = document.getElementById('btn-minimize');
    const btnMaximize = document.getElementById('btn-maximize');
    const titleBar = document.querySelector('.title-bar');

    let isMaximized = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let hasBeenDragged = false;

    // Close/Hide window - show desktop icons
    btnClose.addEventListener('click', () => {
        windowFrame.classList.add('hidden');
        // Show desktop icons
        if (window.desktopManager && window.desktopManager.showDesktop) {
            window.desktopManager.showDesktop();
        } else {
            // Fallback: directly show desktop icons
            const desktopIcons = document.getElementById('desktop-icons');
            if (desktopIcons) {
                desktopIcons.classList.add('visible');
            }
        }
    });

    // Minimize window
    btnMinimize.addEventListener('click', () => {
        windowFrame.classList.add('minimized');
        restoreBtn.classList.add('visible');
    });

    // Maximize/restore window size
    btnMaximize.addEventListener('click', () => {
        isMaximized = !isMaximized;
        windowFrame.classList.toggle('maximized', isMaximized);
    });

    // Restore window
    restoreBtn.addEventListener('click', () => {
        windowFrame.classList.remove('hidden', 'minimized');
        restoreBtn.classList.remove('visible');

        // Focus the terminal input
        setTimeout(() => {
            const activeTerminal = document.querySelector('.tab-content.active');
            const inputEl = activeTerminal?.querySelector('.input-text');
            if (inputEl) inputEl.focus();
        }, 100);
    });

    // Keyboard shortcut to restore (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && restoreBtn.classList.contains('visible')) {
            restoreBtn.click();
        }
    });

    // ==========================================================================
    // WINDOW DRAGGING
    // ==========================================================================

    titleBar.addEventListener('mousedown', (e) => {
        // Don't drag if clicking on buttons
        if (e.target.closest('.btn') || isMaximized) {
            return;
        }

        isDragging = true;
        windowFrame.classList.add('dragging');

        // If first time dragging, switch to absolute positioning
        if (!hasBeenDragged) {
            const rect = windowFrame.getBoundingClientRect();
            windowFrame.style.position = 'absolute';
            windowFrame.style.left = rect.left + 'px';
            windowFrame.style.top = rect.top + 'px';
            windowFrame.style.margin = '0';
            hasBeenDragged = true;
        }

        const rect = windowFrame.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        titleBar.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Keep window within viewport bounds
        const rect = windowFrame.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        windowFrame.style.left = newX + 'px';
        windowFrame.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            titleBar.style.cursor = '';
            windowFrame.classList.remove('dragging');
        }
    });

    // Double-click title bar to maximize/restore
    titleBar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.btn')) {
            btnMaximize.click();
        }
    });

    // ==========================================================================
    // WINDOW RESIZING
    // ==========================================================================

    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 200;

    let isResizing = false;
    let resizeDirection = '';
    let resizeStart = { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 };

    /**
     * Convert window to absolute positioning with explicit dimensions
     */
    function makeWindowAbsolute() {
        const rect = windowFrame.getBoundingClientRect();
        windowFrame.style.position = 'absolute';
        windowFrame.style.left = rect.left + 'px';
        windowFrame.style.top = rect.top + 'px';
        windowFrame.style.width = rect.width + 'px';
        windowFrame.style.height = rect.height + 'px';
        windowFrame.style.margin = '0';
        windowFrame.style.maxWidth = 'none';
        windowFrame.style.maxHeight = 'none';
        hasBeenDragged = true;
    }

    // Handle resize start
    function initResizeHandles() {
        const handles = document.querySelectorAll('.resize-handle');

        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                if (isMaximized) return;

                e.preventDefault();
                e.stopPropagation();

                isResizing = true;
                resizeDirection = handle.dataset.resize;

                // Always ensure we have absolute positioning with explicit dimensions
                if (!hasBeenDragged) {
                    makeWindowAbsolute();
                } else {
                    // Ensure width/height are explicitly set even if already dragged
                    const rect = windowFrame.getBoundingClientRect();
                    if (!windowFrame.style.width) {
                        windowFrame.style.width = rect.width + 'px';
                    }
                    if (!windowFrame.style.height) {
                        windowFrame.style.height = rect.height + 'px';
                    }
                    windowFrame.style.maxWidth = 'none';
                    windowFrame.style.maxHeight = 'none';
                }

                // Add class to disable transitions
                windowFrame.classList.add('resizing');

                const rect = windowFrame.getBoundingClientRect();
                resizeStart = {
                    x: e.clientX,
                    y: e.clientY,
                    width: rect.width,
                    height: rect.height,
                    left: rect.left,
                    top: rect.top
                };
            });
        });
    }

    // Initialize resize handles
    initResizeHandles();

    // Handle resize move
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newLeft = resizeStart.left;
        let newTop = resizeStart.top;

        // Handle horizontal resize
        if (resizeDirection.includes('e')) {
            newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
            const potentialWidth = resizeStart.width - deltaX;
            if (potentialWidth >= MIN_WIDTH) {
                newWidth = potentialWidth;
                newLeft = resizeStart.left + deltaX;
            }
        }

        // Handle vertical resize
        if (resizeDirection.includes('s')) {
            newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
            const potentialHeight = resizeStart.height - deltaY;
            if (potentialHeight >= MIN_HEIGHT) {
                newHeight = potentialHeight;
                newTop = resizeStart.top + deltaY;
            }
        }

        // Keep within viewport
        newLeft = Math.max(0, newLeft);
        newTop = Math.max(0, newTop);
        if (newLeft + newWidth > window.innerWidth) {
            newWidth = window.innerWidth - newLeft;
        }
        if (newTop + newHeight > window.innerHeight) {
            newHeight = window.innerHeight - newTop;
        }

        // Apply new dimensions
        windowFrame.style.width = newWidth + 'px';
        windowFrame.style.height = newHeight + 'px';
        windowFrame.style.left = newLeft + 'px';
        windowFrame.style.top = newTop + 'px';
    });

    // Handle resize end
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizeDirection = '';
            windowFrame.classList.remove('resizing');
        }
    });

})();
