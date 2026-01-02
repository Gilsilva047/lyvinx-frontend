// ===================================
// COMPONENTES UI
// ===================================

const UI = (() => {
    /**
     * Cria um botão
     * @param {object} props - Propriedades do botão
     * @returns {HTMLElement}
     */
    function Button(props = {}) {
        const {
            text = '',
            variant = 'primary',
            size = 'md',
            icon = null,
            iconPosition = 'left',
            onClick = null,
            type = 'button',
            disabled = false,
            fullWidth = false,
            className = ''
        } = props;

        const button = document.createElement('button');
        button.type = type;
        button.className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;
        button.disabled = disabled;

        if (icon && iconPosition === 'left') {
            button.innerHTML = `<i data-lucide="${icon}"></i><span>${text}</span>`;
        } else if (icon && iconPosition === 'right') {
            button.innerHTML = `<span>${text}</span><i data-lucide="${icon}"></i>`;
        } else {
            button.textContent = text;
        }

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        // Inicializa ícones Lucide
        if (icon) {
            setTimeout(() => lucide.createIcons(), 0);
        }

        return button;
    }

    /**
     * Cria um input
     * @param {object} props - Propriedades do input
     * @returns {HTMLElement}
     */
    function Input(props = {}) {
        const {
            label = '',
            type = 'text',
            name = '',
            id = name,
            value = '',
            placeholder = '',
            required = false,
            disabled = false,
            error = '',
            helper = '',
            icon = null,
            iconPosition = 'left',
            onChange = null
        } = props;

        const container = document.createElement('div');
        container.className = 'form-group';

        // Label
        if (label) {
            const labelEl = document.createElement('label');
            labelEl.className = `form-label ${required ? 'form-label-required' : ''}`;
            labelEl.htmlFor = id;
            labelEl.textContent = label;
            container.appendChild(labelEl);
        }

        // Input wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';

        // Ícone
        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.setAttribute('data-lucide', icon);
            iconEl.className = `input-icon input-icon-${iconPosition}`;
            wrapper.appendChild(iconEl);
        }

        // Input
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.id = id;
        input.value = value;
        input.placeholder = placeholder;
        input.required = required;
        input.disabled = disabled;
        input.className = `form-input ${icon && iconPosition === 'left' ? 'input-with-icon-left' : ''} ${icon && iconPosition === 'right' ? 'input-with-icon-right' : ''} ${error ? 'has-error' : ''}`;

        if (onChange) {
            input.addEventListener('input', (e) => onChange(e.target.value));
        }

        wrapper.appendChild(input);
        container.appendChild(wrapper);

        // Helper text
        if (helper && !error) {
            const helperEl = document.createElement('div');
            helperEl.className = 'form-helper';
            helperEl.textContent = helper;
            container.appendChild(helperEl);
        }

        // Error
        if (error) {
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.textContent = error;
            container.appendChild(errorEl);
        }

        // Inicializa ícones Lucide
        if (icon) {
            setTimeout(() => lucide.createIcons(), 0);
        }

        return container;
    }

    /**
     * Cria um card
     * @param {object} props - Propriedades do card
     * @returns {HTMLElement}
     */
    function Card(props = {}) {
        const {
            variant = 'elevated',
            padding = 'md',
            className = '',
            children = null,
            header = null,
            footer = null
        } = props;

        const card = document.createElement('div');
        card.className = `card card-${variant} card-padding-${padding} ${className}`;

        if (header) {
            const headerEl = document.createElement('div');
            headerEl.className = 'card-header';
            if (typeof header === 'string') {
                headerEl.innerHTML = `<h3 class="card-title">${header}</h3>`;
            } else {
                headerEl.appendChild(header);
            }
            card.appendChild(headerEl);
        }

        if (children) {
            const body = document.createElement('div');
            body.className = 'card-body';
            if (typeof children === 'string') {
                body.innerHTML = children;
            } else {
                body.appendChild(children);
            }
            card.appendChild(body);
        }

        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'card-footer';
            if (typeof footer === 'string') {
                footerEl.innerHTML = footer;
            } else {
                footerEl.appendChild(footer);
            }
            card.appendChild(footerEl);
        }

        return card;
    }

    /**
     * Cria um badge
     * @param {object} props - Propriedades do badge
     * @returns {HTMLElement}
     */
    function Badge(props = {}) {
        const {
            text = '',
            variant = 'primary',
            className = ''
        } = props;

        const badge = document.createElement('span');
        badge.className = `badge badge-${variant} ${className}`;
        badge.textContent = text;

        return badge;
    }

    /**
     * Cria um modal
     * @param {object} props - Propriedades do modal
     * @returns {object} - Objeto com métodos para controlar o modal
     */
    function Modal(props = {}) {
        const {
            title = '',
            size = 'md',
            onClose = null
        } = props;

        let overlay = null;
        let modal = null;
        let body = null;

        function create() {
            // Overlay
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';

            // Modal
            modal = document.createElement('div');
            modal.className = `modal modal-${size}`;

            // Header
            const header = document.createElement('div');
            header.className = 'modal-header';
            header.innerHTML = `
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" data-close>
                    <i data-lucide="x"></i>
                </button>
            `;

            // Body
            body = document.createElement('div');
            body.className = 'modal-body';

            modal.appendChild(header);
            modal.appendChild(body);
            overlay.appendChild(modal);

            // Event listeners
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    close();
                }
            });

            header.querySelector('[data-close]').addEventListener('click', close);

            document.addEventListener('keydown', handleEscape);

            // Inicializa ícones Lucide
            setTimeout(() => lucide.createIcons(), 0);
        }

        function handleEscape(e) {
            if (e.key === 'Escape') {
                close();
            }
        }

        function open() {
            if (!overlay) {
                create();
            }
            document.body.appendChild(overlay);
        }

        function close() {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.removeEventListener('keydown', handleEscape);
            if (onClose) {
                onClose();
            }
        }

        function setContent(content) {
            if (!body) create();
            body.innerHTML = '';
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }
        }

        function setFooter(footer) {
            if (!modal) create();

            // Remove footer existente
            const existingFooter = modal.querySelector('.modal-footer');
            if (existingFooter) {
                existingFooter.remove();
            }

            const footerEl = document.createElement('div');
            footerEl.className = 'modal-footer';
            if (typeof footer === 'string') {
                footerEl.innerHTML = footer;
            } else {
                footerEl.appendChild(footer);
            }
            modal.appendChild(footerEl);
        }

        return {
            open,
            close,
            setContent,
            setFooter
        };
    }

    /**
     * Mostra uma notificação toast
     * @param {object} props - Propriedades do toast
     */
    function toast(props = {}) {
        const {
            title = '',
            message = '',
            type = 'info',
            duration = 3000
        } = props;

        // Cria container se não existir
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Cria toast
        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${type}`;

        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        toastEl.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${iconMap[type]}"></i>
            </div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toastEl);

        // Inicializa ícones Lucide
        setTimeout(() => lucide.createIcons(), 0);

        // Remove após duração
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.parentNode.removeChild(toastEl);
                }
                // Remove container se vazio
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }

    /**
     * Cria um loading spinner
     * @param {boolean} fullscreen - Se deve ocupar a tela toda
     * @returns {HTMLElement}
     */
    function Loading(fullscreen = false) {
        const container = document.createElement('div');
        container.className = fullscreen ? 'loading-fullscreen' : 'loading-spinner';

        if (fullscreen) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            container.appendChild(spinner);
        }

        return container;
    }

    return {
        Button,
        Input,
        Card,
        Badge,
        Modal,
        toast,
        Loading
    };
})();
