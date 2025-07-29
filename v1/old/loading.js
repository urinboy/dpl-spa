/* src/assets/js/components/loading.js */
import DOMPurify from 'dompurify';

export class Loading {
    show(message = 'Yuklanmoqda...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <span class="loading-message">${DOMPurify.sanitize(message)}</span>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hide() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) overlay.remove();
    }
}

window.DPL = window.DPL || {};
window.DPL.simpleLoading = new Loading();