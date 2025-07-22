/* src/assets/js/app.js */
import { Toast } from './components/toast.js';
import { Loading } from './components/loading.js';

window.DPL = window.DPL || {};

// Navigatsiya funksiyasi
window.DPL.navigate = function(page) {
    DPL.simpleLoading.show(`Yuklanmoqda: ${page}`);
    setTimeout(() => {
        document.getElementById('main-content').innerHTML = `<h2>${page.charAt(0).toUpperCase() + page.slice(1)}</h2>`;
        DPL.simpleLoading.hide();
    }, 500);
};

// Boshlang‘ich sozlash
document.addEventListener('DOMContentLoaded', () => {
    DPL.simpleToast.success('Ilova muvaffaqiyatli yuklandi!');
});