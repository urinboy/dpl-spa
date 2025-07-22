// UI Components - Reusable UI elements and utilities
const UI = {
    
    // Toast notification system
    Toast: {
        container: null,
        queue: [],
        isProcessing: false,

        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: ${CSS.escape('var(--z-toast)')};
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', options = {}) {
            this.init();
            
            const {
                duration = Config.APP.TOAST_DURATION,
                actions = [],
                dismissible = true,
                position = 'top-right'
            } = options;

            const toast = {
                id: Utils.generateId('toast'),
                message,
                type,
                duration,
                actions,
                dismissible,
                position
            };

            this.queue.push(toast);
            this.processQueue();
        },

        async processQueue() {
            if (this.isProcessing || this.queue.length === 0) return;
            
            this.isProcessing = true;
            const toast = this.queue.shift();
            
            await this.renderToast(toast);
            
            this.isProcessing = false;
            
            // Process next toast
            if (this.queue.length > 0) {
                setTimeout(() => this.processQueue(), 300);
            }
        },

        async renderToast(toast) {
            const toastElement = document.createElement('div');
            toastElement.className = `toast ${toast.type}`;
            toastElement.id = toast.id;
            toastElement.style.cssText = `
                pointer-events: auto;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;

            const icon = this.getTypeIcon(toast.type);
            
            toastElement.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-${icon} toast-icon"></i>
                    <span class="toast-message">${Utils.sanitizeHtml(toast.message)}</span>
                    ${toast.dismissible ? '<button class="toast-close" onclick="UI.Toast.dismiss(\'' + toast.id + '\')"><i class="fas fa-times"></i></button>' : ''}
                </div>
                ${toast.actions.length > 0 ? this.renderActions(toast.actions) : ''}
            `;

            this.container.appendChild(toastElement);

            // Animate in
            requestAnimationFrame(() => {
                toastElement.style.transform = 'translateX(0)';
            });

            // Auto dismiss
            if (toast.duration > 0) {
                setTimeout(() => {
                    this.dismiss(toast.id);
                }, toast.duration);
            }
        },

        renderActions(actions) {
            const actionsHtml = actions.map(action => 
                `<button class="toast-action" onclick="${action.onClick}">${action.label}</button>`
            ).join('');
            
            return `<div class="toast-actions">${actionsHtml}</div>`;
        },

        getTypeIcon(type) {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            return icons[type] || icons.info;
        },

        dismiss(toastId) {
            const toastElement = document.getElementById(toastId);
            if (toastElement) {
                toastElement.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    toastElement.remove();
                }, 300);
            }
        },

        dismissAll() {
            const toasts = this.container.querySelectorAll('.toast');
            toasts.forEach(toast => {
                this.dismiss(toast.id);
            });
        },

        // Convenience methods
        success(message, options = {}) {
            this.show(message, 'success', options);
        },

        error(message, options = {}) {
            this.show(message, 'error', options);
        },

        warning(message, options = {}) {
            this.show(message, 'warning', options);
        },

        info(message, options = {}) {
            this.show(message, 'info', options);
        }
    },

    // Loading overlay system
    Loading: {
        overlay: null,
        isVisible: false,

        show(message = 'Yuklanmoqda...', options = {}) {
            const { 
                backdrop = true, 
                spinner = true,
                cancellable = false,
                onCancel = null 
            } = options;

            if (this.isVisible) {
                this.updateMessage(message);
                return;
            }

            this.overlay = document.createElement('div');
            this.overlay.id = 'loadingOverlay';
            this.overlay.className = 'loading-overlay';
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${backdrop ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: var(--z-modal);
                backdrop-filter: blur(2px);
            `;

            const content = document.createElement('div');
            content.className = 'loading-content';
            content.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: var(--shadow-lg);
                max-width: 300px;
            `;

            content.innerHTML = `
                ${spinner ? '<div class="spinner" style="margin: 0 auto 1rem;"></div>' : ''}
                <div class="loading-message" style="color: var(--gray-800); font-weight: 600;">${Utils.sanitizeHtml(message)}</div>
                ${cancellable ? '<button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="UI.Loading.cancel()">Bekor qilish</button>' : ''}
            `;

            this.overlay.appendChild(content);
            document.body.appendChild(this.overlay);

            if (cancellable && onCancel) {
                this.onCancel = onCancel;
            }

            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            this.isVisible = true;

            // Animate in
            requestAnimationFrame(() => {
                this.overlay.style.opacity = '1';
            });
        },

        updateMessage(message) {
            if (this.overlay) {
                const messageElement = this.overlay.querySelector('.loading-message');
                if (messageElement) {
                    messageElement.textContent = message;
                }
            }
        },

        hide() {
            if (this.overlay && this.isVisible) {
                this.overlay.style.opacity = '0';
                setTimeout(() => {
                    if (this.overlay && this.overlay.parentNode) {
                        this.overlay.parentNode.removeChild(this.overlay);
                    }
                    this.overlay = null;
                    this.isVisible = false;
                    document.body.style.overflow = '';
                }, 300);
            }
        },

        cancel() {
            if (this.onCancel) {
                this.onCancel();
            }
            this.hide();
        }
    },

    // Modal system
    Modal: {
        activeModals: new Set(),

        show(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                this.activeModals.add(modalId);
                document.body.style.overflow = 'hidden';
                
                // Focus management
                this.trapFocus(modal);
                
                // Add backdrop click listener
                modal.addEventListener('click', this.handleBackdropClick.bind(this));
            }
        },

        hide(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                this.activeModals.delete(modalId);
                
                if (this.activeModals.size === 0) {
                    document.body.style.overflow = '';
                }
                
                modal.removeEventListener('click', this.handleBackdropClick.bind(this));
            }
        },

        hideAll() {
            this.activeModals.forEach(modalId => {
                this.hide(modalId);
            });
        },

        handleBackdropClick(event) {
            if (event.target.classList.contains('modal')) {
                this.hide(event.target.id);
            }
        },

        trapFocus(modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                if (e.key === 'Escape') {
                    this.hide(modal.id);
                }
            });

            if (firstElement) {
                firstElement.focus();
            }
        }
    },

    // Progress bar component
    ProgressBar: {
        create(options = {}) {
            const {
                value = 0,
                max = 100,
                showLabel = true,
                animated = true,
                color = 'var(--primary-color)',
                height = '8px'
            } = options;

            const container = document.createElement('div');
            container.className = 'progress-bar-container';
            container.style.cssText = `
                width: 100%;
                background: var(--gray-200);
                border-radius: ${height};
                overflow: hidden;
                position: relative;
            `;

            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.style.cssText = `
                height: ${height};
                background: ${color};
                width: ${(value / max) * 100}%;
                transition: ${animated ? 'width 0.3s ease' : 'none'};
                border-radius: ${height};
            `;

            const label = document.createElement('div');
            label.className = 'progress-label';
            label.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: bold;
                color: var(--gray-700);
                display: ${showLabel ? 'block' : 'none'};
            `;
            label.textContent = `${Math.round((value / max) * 100)}%`;

            container.appendChild(bar);
            container.appendChild(label);

            return {
                element: container,
                update: (newValue) => {
                    const percentage = Math.min(Math.max((newValue / max) * 100, 0), 100);
                    bar.style.width = `${percentage}%`;
                    if (showLabel) {
                        label.textContent = `${Math.round(percentage)}%`;
                    }
                },
                setValue: (newValue) => {
                    return this.update(newValue);
                },
                setColor: (newColor) => {
                    bar.style.background = newColor;
                }
            };
        }
    },

    // Skeleton loader component
    Skeleton: {
        create(options = {}) {
            const {
                width = '100%',
                height = '20px',
                borderRadius = '4px',
                lines = 1,
                gap = '8px'
            } = options;

            const container = document.createElement('div');
            container.className = 'skeleton-container';
            container.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: ${gap};
            `;

            for (let i = 0; i < lines; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton';
                skeleton.style.cssText = `
                    width: ${Array.isArray(width) ? width[i] || width[0] : width};
                    height: ${height};
                    border-radius: ${borderRadius};
                `;
                container.appendChild(skeleton);
            }

            return container;
        },

        createCard() {
            return this.create({
                lines: 4,
                width: ['100%', '80%', '60%', '90%'],
                height: '16px',
                gap: '12px'
            });
        },

        createList(items = 3) {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

            for (let i = 0; i < items; i++) {
                const item = this.create({
                    lines: 2,
                    width: ['100%', '70%'],
                    height: '14px'
                });
                container.appendChild(item);
            }

            return container;
        }
    },

    // Dropdown component
    Dropdown: {
        activeDropdown: null,

        init(triggerSelector, dropdownSelector, options = {}) {
            const trigger = document.querySelector(triggerSelector);
            const dropdown = document.querySelector(dropdownSelector);
            
            if (!trigger || !dropdown) return;

            const {
                placement = 'bottom-start',
                closeOnClick = true,
                closeOnOutsideClick = true
            } = options;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle(dropdown, trigger, placement);
            });

            if (closeOnClick) {
                dropdown.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        this.hide(dropdown);
                    }
                });
            }

            if (closeOnOutsideClick) {
                document.addEventListener('click', (e) => {
                    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                        this.hide(dropdown);
                    }
                });
            }
        },

        toggle(dropdown, trigger, placement) {
            if (this.activeDropdown === dropdown) {
                this.hide(dropdown);
            } else {
                this.show(dropdown, trigger, placement);
            }
        },

        show(dropdown, trigger, placement) {
            this.hideAll();
            
            dropdown.style.display = 'block';
            this.position(dropdown, trigger, placement);
            
            requestAnimationFrame(() => {
                dropdown.classList.add('show');
            });

            this.activeDropdown = dropdown;
        },

        hide(dropdown) {
            dropdown.classList.remove('show');
            setTimeout(() => {
                dropdown.style.display = 'none';
                if (this.activeDropdown === dropdown) {
                    this.activeDropdown = null;
                }
            }, 150);
        },

        hideAll() {
            if (this.activeDropdown) {
                this.hide(this.activeDropdown);
            }
        },

        position(dropdown, trigger, placement) {
            const triggerRect = trigger.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();
            
            let top, left;

            switch (placement) {
                case 'bottom-start':
                    top = triggerRect.bottom + window.scrollY;
                    left = triggerRect.left + window.scrollX;
                    break;
                case 'bottom-end':
                    top = triggerRect.bottom + window.scrollY;
                    left = triggerRect.right + window.scrollX - dropdownRect.width;
                    break;
                case 'top-start':
                    top = triggerRect.top + window.scrollY - dropdownRect.height;
                    left = triggerRect.left + window.scrollX;
                    break;
                case 'top-end':
                    top = triggerRect.top + window.scrollY - dropdownRect.height;
                    left = triggerRect.right + window.scrollX - dropdownRect.width;
                    break;
                default:
                    top = triggerRect.bottom + window.scrollY;
                    left = triggerRect.left + window.scrollX;
            }

            dropdown.style.position = 'absolute';
            dropdown.style.top = `${top}px`;
            dropdown.style.left = `${left}px`;
            dropdown.style.zIndex = 'var(--z-dropdown)';
        }
    },

    // Pagination component
    Pagination: {
        create(options = {}) {
            const {
                currentPage = 1,
                totalPages = 1,
                onPageChange = () => {},
                showFirstLast = true,
                showPrevNext = true,
                maxVisiblePages = 5
            } = options;

            const container = document.createElement('div');
            container.className = 'pagination';
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            `;

            // First page button
            if (showFirstLast && currentPage > 1) {
                const firstBtn = this.createButton('1', () => onPageChange(1));
                container.appendChild(firstBtn);
                
                if (currentPage > maxVisiblePages) {
                    container.appendChild(this.createEllipsis());
                }
            }

            // Previous button
            if (showPrevNext && currentPage > 1) {
                const prevBtn = this.createButton('‹', () => onPageChange(currentPage - 1), 'prev');
                container.appendChild(prevBtn);
            }

            // Page numbers
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = this.createButton(
                    i.toString(), 
                    () => onPageChange(i), 
                    i === currentPage ? 'active' : ''
                );
                container.appendChild(pageBtn);
            }

            // Next button
            if (showPrevNext && currentPage < totalPages) {
                const nextBtn = this.createButton('›', () => onPageChange(currentPage + 1), 'next');
                container.appendChild(nextBtn);
            }

            // Last page button
            if (showFirstLast && currentPage < totalPages) {
                if (currentPage < totalPages - maxVisiblePages + 1) {
                    container.appendChild(this.createEllipsis());
                }
                
                const lastBtn = this.createButton(totalPages.toString(), () => onPageChange(totalPages));
                container.appendChild(lastBtn);
            }

            return container;
        },

        createButton(text, onClick, className = '') {
            const button = document.createElement('button');
            button.className = `pagination-btn ${className}`;
            button.textContent = text;
            button.style.cssText = `
                padding: 0.5rem 0.75rem;
                border: 1px solid var(--gray-300);
                background: var(--white);
                color: var(--gray-700);
                border-radius: var(--radius);
                cursor: pointer;
                transition: var(--transition-normal);
                min-width: 40px;
            `;

            if (className === 'active') {
                button.style.background = 'var(--primary-color)';
                button.style.color = 'var(--white)';
                button.style.borderColor = 'var(--primary-color)';
            }

            button.addEventListener('click', onClick);
            
            button.addEventListener('mouseenter', () => {
                if (className !== 'active') {
                    button.style.background = 'var(--gray-50)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (className !== 'active') {
                    button.style.background = 'var(--white)';
                }
            });

            return button;
        },

        createEllipsis() {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.cssText = `
                padding: 0.5rem 0.25rem;
                color: var(--gray-500);
            `;
            return span;
        }
    },

    // Tabs component
    Tabs: {
        init(containerSelector, options = {}) {
            const container = document.querySelector(containerSelector);
            if (!container) return;

            const {
                activeClass = 'active',
                onChange = () => {}
            } = options;

            const tabs = container.querySelectorAll('[data-tab]');
            const panels = container.querySelectorAll('[data-panel]');

            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetPanel = tab.dataset.tab;
                    
                    // Remove active class from all tabs and panels
                    tabs.forEach(t => t.classList.remove(activeClass));
                    panels.forEach(p => p.classList.remove(activeClass));
                    
                    // Add active class to clicked tab and corresponding panel
                    tab.classList.add(activeClass);
                    const panel = container.querySelector(`[data-panel="${targetPanel}"]`);
                    if (panel) {
                        panel.classList.add(activeClass);
                    }
                    
                    onChange(targetPanel, tab, panel);
                });
            });
        }
    },

    // Accordion component
    Accordion: {
        init(containerSelector, options = {}) {
            const container = document.querySelector(containerSelector);
            if (!container) return;

            const {
                allowMultiple = false,
                activeClass = 'active'
            } = options;

            const triggers = container.querySelectorAll('[data-accordion-trigger]');

            triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const target = trigger.getAttribute('data-accordion-trigger');
                    const panel = container.querySelector(`[data-accordion-panel="${target}"]`);
                    
                    if (!panel) return;

                    const isActive = trigger.classList.contains(activeClass);

                    if (!allowMultiple) {
                        // Close all other panels
                        triggers.forEach(t => t.classList.remove(activeClass));
                        container.querySelectorAll('[data-accordion-panel]')
                            .forEach(p => p.classList.remove(activeClass));
                    }

                    if (!isActive) {
                        trigger.classList.add(activeClass);
                        panel.classList.add(activeClass);
                    } else if (allowMultiple) {
                        trigger.classList.remove(activeClass);
                        panel.classList.remove(activeClass);
                    }
                });
            });
        }
    },

    // Image lazy loading
    LazyLoad: {
        observer: null,

        init(selector = 'img[data-src]', options = {}) {
            const {
                rootMargin = '50px',
                threshold = 0.1
            } = options;

            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                }, { rootMargin, threshold });

                document.querySelectorAll(selector).forEach(img => {
                    this.observer.observe(img);
                });
            } else {
                // Fallback for older browsers
                document.querySelectorAll(selector).forEach(img => {
                    this.loadImage(img);
                });
            }
        },

        loadImage(img) {
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
            }
        },

        refresh() {
            if (this.observer) {
                document.querySelectorAll('img[data-src]').forEach(img => {
                    this.observer.observe(img);
                });
            }
        }
    },

    // Form validation
    Validation: {
        rules: {
            required: (value) => value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^(\+998|998)?[0-9]{9}$/.test(value.replace(/[\s\-\(\)]/g, '')),
            minLength: (value, min) => value.length >= min,
            maxLength: (value, max) => value.length <= max,
            numeric: (value) => /^\d+$/.test(value),
            alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value)
        },

        messages: {
            required: 'Bu maydon to\'ldirilishi shart',
            email: 'Email manzilni to\'g\'ri kiriting',
            phone: 'Telefon raqamni to\'g\'ri kiriting',
            minLength: 'Kamida {min} ta belgi kiriting',
            maxLength: 'Ko\'pi bilan {max} ta belgi kiriting',
            numeric: 'Faqat raqam kiriting',
            alphanumeric: 'Faqat harf va raqam kiriting'
        },

        validate(form) {
            const errors = {};
            const inputs = form.querySelectorAll('[data-validation]');

            inputs.forEach(input => {
                const rules = input.dataset.validation.split('|');
                const fieldErrors = [];

                rules.forEach(rule => {
                    const [ruleName, ...params] = rule.split(':');
                    const ruleFunction = this.rules[ruleName];

                    if (ruleFunction) {
                        const isValid = ruleFunction(input.value, ...params);
                        if (!isValid) {
                            let message = this.messages[ruleName] || 'Xatolik';
                            params.forEach((param, index) => {
                                message = message.replace(`{${Object.keys(params)[index] || index}}`, param);
                            });
                            fieldErrors.push(message);
                        }
                    }
                });

                if (fieldErrors.length > 0) {
                    errors[input.name || input.id] = fieldErrors;
                    this.showFieldError(input, fieldErrors[0]);
                } else {
                    this.clearFieldError(input);
                }
            });

            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        },

        showFieldError(input, message) {
            input.classList.add('error');
            
            let errorElement = input.parentNode.querySelector('.form-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                input.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        },

        clearFieldError(input) {
            input.classList.remove('error');
            const errorElement = input.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        },

        clearAllErrors(form) {
            const inputs = form.querySelectorAll('.error');
            inputs.forEach(input => this.clearFieldError(input));
        }
    },

    // Utility functions
    Utils: {
        // Animate element scroll into view
        scrollIntoView(element, options = {}) {
            const {
                behavior = 'smooth',
                block = 'center',
                inline = 'nearest',
                offset = 0
            } = options;

            if (typeof element === 'string') {
                element = document.querySelector(element);
            }

            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior
                });
            }
        },

        // Create and trigger file download
        downloadFile(data, filename, type = 'application/json') {
            const blob = new Blob([data], { type });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },

        // Copy text to clipboard with fallback
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                UI.Toast.success('Nusxalandi!');
                return true;
            } catch (err) {
                // Fallback method
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    UI.Toast.success('Nusxalandi!');
                    return true;
                } catch (fallbackErr) {
                    UI.Toast.error('Nusxalashda xatolik!');
                    return false;
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        },

        // Debounced input handler
        debounceInput(input, callback, delay = 300) {
            let timeoutId;
            
            input.addEventListener('input', (e) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    callback(e.target.value, e);
                }, delay);
            });
        },

        // Auto-resize textarea
        autoResizeTextarea(textarea) {
            const resize = () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            };

            textarea.addEventListener('input', resize);
            textarea.addEventListener('change', resize);
            
            // Initial resize
            resize();
        },

        // Format currency input
        formatCurrencyInput(input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString('uz-UZ');
                }
                e.target.value = value;
            });
        }
    }
};

// Initialize UI components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    UI.LazyLoad.init();
    
    // Initialize dropdowns
    document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
        const target = trigger.getAttribute('data-dropdown-trigger');
        const dropdown = document.querySelector(`[data-dropdown="${target}"]`);
        if (dropdown) {
            UI.Dropdown.init(`[data-dropdown-trigger="${target}"]`, `[data-dropdown="${target}"]`);
        }
    });
    
    // Initialize tabs
    document.querySelectorAll('[data-tabs]').forEach(container => {
        UI.Tabs.init(`#${container.id}`);
    });
    
    // Initialize accordions
    document.querySelectorAll('[data-accordion]').forEach(container => {
        UI.Accordion.init(`#${container.id}`);
    });

    // Auto-resize textareas
    document.querySelectorAll('textarea[data-auto-resize]').forEach(textarea => {
        UI.Utils.autoResizeTextarea(textarea);
    });

    // Format currency inputs
    document.querySelectorAll('input[data-currency]').forEach(input => {
        UI.Utils.formatCurrencyInput(input);
    });
});

// Make UI globally available
window.UI = UI;