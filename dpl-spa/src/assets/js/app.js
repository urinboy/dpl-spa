import './config.js';
import './utils.js';
import './storage.js';
import './services/api.js';
import './components/ui.js';
import './managers/auth.js';
import './managers/cart.js';
import Router from './router.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('App Initialized');
            // Router handles the rest
        });
    }
}

new App();
