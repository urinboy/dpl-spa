dpl-spa loyihasini qayta ishlab chiqish: 1-bosqich – Loyiha tuzilishini qayta tashkil qilish
Maqsad
Fayl tuzilishini soddalashtirish, chalkashliklarni bartaraf qilish, inline CSS va JavaScript kodlarini alohida fayllarga ko‘chirish va modulli tuzilma yaratish.
Vazifalar va amallar
1. Fayllarni tozalash

Maqsad: Keraksiz fayllarni o‘chirish va faqat bitta asosiy index.html faylini qoldirish.
Amallar:
index-1.html, index-new.html va boshqa keraksiz fayllarni o‘chirish.
index-new.html dizaynini asos qilib, uni index.htmlga ko‘chirish.
index.html faylini tozalab, inline CSS va JavaScript kodlarini alohida fayllarga ko‘chirish uchun tayyorlash.



2. Yangi direktoriya tuzilmasini yaratish

Maqsad: Modulli va tushunarli fayl tuzilmasini shakllantirish.

Direktoriya tuzilmasi:
dpl-spa/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── base.css
│   │   │   ├── components.css
│   │   │   ├── pages.css
│   │   │   ├── variables.css
│   │   │   └── responsive.css
│   │   ├── js/
│   │   │   ├── components/
│   │   │   │   ├── toast.js
│   │   │   │   ├── loading.js
│   │   │   │   └── ui.js
│   │   │   ├── managers/
│   │   │   │   ├── auth.js
│   │   │   │   └── cart.js
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   └── storage.js
│   │   │   ├── utils/
│   │   │   │   ├── events.js
│   │   │   │   └── helpers.js
│   │   │   └── app.js
│   ├── index.html
├── tests/
│   ├── unit/
│   │   ├── auth.test.js
│   │   └── cart.test.js
├── README.md
├── package.json
└── .gitignore


Amallar:

Yuqoridagi tuzilma asosida papkalar va fayllarni yaratish:mkdir -p dpl-spa/src/assets/{css,js/{components,managers,services,utils}} dpl-spa/tests/unit
touch dpl-spa/src/index.html
touch dpl-spa/src/assets/css/{base.css,components.css,pages.css,variables.css,responsive.css}
touch dpl-spa/src/assets/js/components/{toast.js,loading.js,ui.js}
touch dpl-spa/src/assets/js/managers/{auth.js,cart.js}
touch dpl-spa/src/assets/js/services/{api.js,storage.js}
touch dpl-spa/src/assets/js/utils/{events.js,helpers.js}
touch dpl-spa/src/assets/js/app.js
touch dpl-spa/tests/unit/{auth.test.js,cart.test.js}
touch dpl-spa/{README.md,package.json,.gitignore}


.gitignore fayliga quyidagi qatorlarni qo‘shish:node_modules/
dist/
.env
*.log


package.json faylini sozlash:{
  "name": "dpl-spa",
  "version": "1.0.0",
  "description": "DPL Single Page Application",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "test": "jest"
  },
  "dependencies": {
    "dompurify": "^2.4.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "jest": "^29.0.0"
  }
}


Vite-ni o‘rnatish (tezkor ishlash uchun):npm install





3. Inline kodlarni alohida fayllarga ko‘chirish

Maqsad: index-new.htmldagi inline CSS va JavaScript kodlarini alohida fayllarga ajratish.
Amallar:
Inline CSSni ko‘chirish:
index-new.htmldagi barcha <style> teglarini src/assets/css/components.css va src/assets/css/variables.css fayllariga ko‘chirish.
Misol uchun, index-new.htmldagi toast va loading stillarini components.cssga ko‘chirish:/* src/assets/css/components.css */
.toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: var(--z-toast);
}
.toast {
    will-change: transform;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    background: var(--toast-bg, #fff);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.toast.success { background: var(--success-bg, #28a745); }
.toast.error { background: var(--error-bg, #dc3545); }
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-loading);
    display: flex;
    justify-content: center;
    align-items: center;
}
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color, #007bff);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}


O‘zgaruvchilarni variables.cssga qo‘shish:/* src/assets/css/variables.css */
:root {
    --z-toast: 9999;
    --z-loading: 10000;
    --primary-color: #007bff;
    --success-bg: #28a745;
    --error-bg: #dc3545;
    --toast-bg: #fff;
}


Mobil optimallashtirish uchun responsive.css:/* src/assets/css/responsive.css */
@media (max-width: 768px) {
    .toast-container {
        left: 0.5rem;
        right: 0.5rem;
        max-width: unset;
    }
    .loading-overlay .loading-content {
        flex-direction: column;
        text-align: center;
    }
}




Inline JavaScriptni ko‘chirish:
index-new.htmldagi SimpleToast va SimpleLoading sinflarini src/assets/js/components/toast.js va src/assets/js/components/loading.js fayllariga ko‘chirish.
toast.js:/* src/assets/js/components/toast.js */
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


loading.js:/* src/assets/js/components/loading.js */
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




index.html ni yangilash:
Inline kodlarni olib tashlash va CSS/JavaScript fayllarini ulash:<!-- src/index.html -->
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DPL SPA</title>
    <link rel="stylesheet" href="assets/css/variables.css">
    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="stylesheet" href="assets/css/pages.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <script src="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
</head>
<body>
    <div id="app">
        <header>
            <nav class="navbar">
                <div class="logo">DPL</div>
                <ul class="nav-links">
                    <li><a href="#" onclick="DPL.navigate('home')">Bosh sahifa</a></li>
                    <li><a href="#" onclick="DPL.navigate('products')">Mahsulotlar</a></li>
                    <li><a href="#" onclick="DPL.navigate('cart')">Savat</a></li>
                    <li><a href="#" onclick="DPL.navigate('profile')">Profil</a></li>
                </ul>
            </nav>
        </header>
        <main id="main-content">
            <div id="categoriesGrid" class="categories-grid"></div>
            <div id="productsGrid" class="products-grid"></div>
            <div id="cartContainer" class="cart-container"></div>
        </main>
        <footer>
            <p>&copy; 2025 DPL. Barcha huquqlar himoyalangan.</p>
        </footer>
    </div>
    <script type="module" src="assets/js/app.js"></script>
</body>
</html>







4. CSS modulligini yaxshilash

Maqsad: !important ishlatishni minimallashtirish va z-indexlarni o‘zgaruvchilar orqali boshqarish.
Amallar:
variables.css faylida z-index va rang o‘zgaruvchilarini aniqlash (yuqorida keltirilgan).
Barcha CSS fayllarida o‘zgaruvchilardan foydalanish:/* src/assets/css/base.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: Arial, sans-serif;
    background: var(--background, #f8f9fa);
}
.navbar {
    background: var(--primary-color, #007bff);
    color: #fff;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.categories-grid, .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
}


!important ishlatilgan joylarni tekshirish va ularni olib tashlash yoki CSS o‘zgaruvchilari bilan almashtirish.



5. Asosiy JavaScript faylini sozlash

Maqsad: Loyiha funksionalligini boshqarish uchun app.js faylini yaratish.
Amallar:
app.js fayliga asosiy navigatsiya va boshlang‘ich logikani qo‘shish:/* src/assets/js/app.js */
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





6. README faylini yangilash

Maqsad: Loyiha haqida umumiy ma‘lumot va o‘rnatish qo‘llanmasini qo‘shish.
Amallar:
README.md fayliga quyidagi ma‘lumotlarni qo‘shish:
# DPL SPA

Bu DPL loyihasining yagona sahifali ilovasi (Single Page Application) bo‘lib, zamonaviy veb-texnologiyalar yordamida ishlab chiqilgan.

## O‘rnatish

1. Repozitoriyani klonlash:
   ```bash
   git clone https://github.com/urinboy/dpl-spa.git
   cd dpl-spa


Bog‘liqliklarni o‘rnatish:npm install


Loyihani ishga tushirish:npm start



Tuzilma

src/assets/css/ - CSS fayllari (variables, components, va boshqalar)
src/assets/js/ - JavaScript modullari (components, managers, services, utils)
tests/ - Unit testlar

Texnologiyalar

Vite: Tez ishlash uchun build vositasi
DOMPurify: XSS hujumlariga qarshi himoya
Font Awesome: Ikonkalar uchun

Keyingi qadamlar

API integratsiyasi
Autentifikatsiya va savat funksionalligini kengaytirish







Natijalar

Soddalashtirilgan va modulli fayl tuzilmasi.
Inline CSS va JavaScript kodlarining yo‘qligi.
index-new.html dizayniga asoslangan toza index.html.
CSS o‘zgaruvchilari orqali boshqariladigan stillar.
Loyiha boshlang‘ich sozlamalari va hujjatlashtirish tayyor.

Davomiylik

Taxminan 2-3 kun (jamoa hajmi va tajribasiga qarab).

Keyingi qadam
Ikkinchi bosqichda API integratsiyasini sozlash va haqiqiy backend bilan ulashni boshlaymiz. Agar ushbu bosqichda qo‘shimcha o‘zgartirishlar yoki aniqlik kiritish kerak bo‘lsa, iltimos, ayting!