/* src/assets/js/components/toast.js */
import DOMPurify from 'dompurify';

export class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    show(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getTypeIcon(type)} toast-icon"></i>
                <span class="toast-message">${DOMPurify.sanitize(message)}</span>
                <button class="toast-close">×</button>
            </div>
        `;
        this.container.appendChild(toast);
        toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
        setTimeout(() => toast.remove(), duration);
    }

    getTypeIcon(type) {
        return { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' }[type] || 'info-circle';
    }
}

window.DPL = window.DPL || {};
window.DPL.simpleToast = new Toast();