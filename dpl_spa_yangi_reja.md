dpl-spa loyihasini qayta ishlab chiqish rejasi
Maqsad
index-new.html dizayniga asoslangan holda, urinboy/dpl-spa loyihasini qayta ishlab chiqish, aniqlangan kamchiliklarni bartaraf qilish va haqiqiy API bilan integratsiya qilish orqali ishonchli, samarali va foydalanuvchi uchun qulay veb-ilova yaratish.
Umumiy strategiya

Loyiha tuzilishini soddalashtirish va modulli qilish.
index-new.html dizaynini asos qilib, inline kodlarni alohida fayllarga ko‘chirish.
Haqiqiy API integratsiyasini amalga oshirish va xavfsizlikni ta'minlash.
Kod sifatini yaxshilash uchun hujjatlashtirish va unit testlarni joriy qilish.
Foydalanuvchi tajribasini optimallashtirish va ishlash samaradorligini oshirish.

Bosqichlar
1-bosqich: Loyiha tuzilishini qayta tashkil qilish
Maqsad: Fayl tuzilishini soddalashtirish, chalkashliklarni bartaraf qilish va modulli tuzilma yaratish.

Vazifalar:

Fayllarni tozalash:
index-1.html va boshqa keraksiz fayllarni o‘chirish.
Faqat index.htmlni asosiy fayl sifatida qoldirish va uni index-new.html dizayniga moslashtirish.


Yangi direktoriya tuzilmasi:dpl-spa/
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


Inline kodlarni ko‘chirish:
index-new.htmldagi inline CSSni src/assets/css/ papkasiga ko‘chirish (masalan, components.cssga toast va loading stillarini).
Inline JavaScriptni (SimpleToast va SimpleLoading) src/assets/js/components/ papkasiga ko‘chirish (toast.js va loading.js).


CSS modulligini yaxshilash:
--z-index va rang o‘zgaruvchilarini variables.cssda birlashtirish.
!important ishlatishni minimallashtirish va z-indexlarni o‘zgaruvchilar orqali boshqarish.




Natija:

Soddalashtirilgan fayl tuzilishi.
Inline kodlarning yo‘qligi.
CSS va JavaScript modullari aniq ajratilgan.


Davomiyligi: 2-3 kun



2-bosqich: API integratsiyasini sozlash
Maqsad: Haqiqiy API endpointlarini qo‘shish va xavfsiz so‘rovlarni amalga oshirish.

Vazifalar:

API xizmatini yaratish (src/assets/js/services/api.js):
Haqiqiy backend API bilan ishlash uchun fetch yoki axiosdan foydalanish.
API so‘rovlarini boshqarish uchun sinf yaratish:class API {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    async get(endpoint, params = {}) {
        const response = await fetch(`${this.baseUrl}/${endpoint}?${new URLSearchParams(params)}`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        return await response.json();
    }

    async post(endpoint, data) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
}

export default new API('https://api.dpl-spa.uz');




API endpointlarini sozlash:
Kategoriyalar: GET /categories
Mahsulotlar: GET /products, GET /products/:id
Savat: GET /cart, POST /cart/add, PUT /cart/update, DELETE /cart/remove
Autentifikatsiya: POST /auth/login, POST /auth/register, POST /auth/refresh


Xatolarni boshqarish:
Tarmoq xatolari, 401 (Unauthorized), va 500 (Server Error) holatlarini boshqarish.
Foydalanuvchiga aniq xabarlar ko‘rsatish:async getCategories() {
    try {
        const response = await API.get('categories');
        if (!response.success) throw new Error(response.message || 'Kategoriyalarni olishda xatolik');
        return response.data;
    } catch (error) {
        window.simpleToast.error(error.message || 'Tarmoqqa ulanishda xatolik');
        throw error;
    }
}






Natija:

Haqiqiy API bilan to‘liq integratsiya.
Xavfsiz va xatolarni boshqaradigan API xizmati.
Foydalanuvchiga aniq xato xabarlari.


Davomiyligi: 3-4 kun



3-bosqich: Autentifikatsiya va savat funksionalligini takomillashtirish
Maqsad: AuthManager va CartManager sinflarini optimallashtirish va xavfsizlikni oshirish.

Vazifalar:

AuthManager sinfini yaxshilash:
Global window o‘rniga namespace ishlatish:window.DPL = window.DPL || {};
DPL.AuthManager = new AuthManager();


Token yangilashni haqiqiy API bilan integratsiya qilish:async refreshToken() {
    try {
        const response = await API.post('auth/refresh', { token: this.authToken });
        if (response.success) {
            this.authToken = response.data.token;
            AuthStore.setToken(this.authToken);
            return true;
        }
        throw new Error('Token yangilashda xatolik');
    } catch (error) {
        DPL.simpleToast.error('Sessiya tugadi. Qayta kiring.');
        this.handleLogout();
        throw error;
    }
}


XSS hujumlariga qarshi sessionStorage ishlatish:AuthStore.setToken(token) {
    sessionStorage.setItem('auth_token', token);
}




CartManager sinfini optimallashtirish:
Savat sinxronizatsiyasini optimallashtirish:async syncCart() {
    if (!DPL.AuthManager.checkAuth()) return;
    try {
        DPL.simpleLoading.show('Savat sinxronizatsiya qilinmoqda...');
        for (const item of this.localCart.items) {
            await API.post('cart/add', {
                product_id: item.product_id,
                quantity: item.quantity
            });
        }
        this.clearLocalCart();
        await this.loadCart();
        DPL.simpleToast.success('Savat sinxronizatsiya qilindi');
    } catch (error) {
        DPL.simpleToast.error('Savat sinxronizatsiyasida xatolik');
    } finally {
        DPL.simpleLoading.hide();
    }
}


Savat validatsiyasini kengaytirish:validateCart() {
    const errors = [];
    const cart = DPL.AuthManager.checkAuth() ? this.cart : this.localCart;
    if (!cart.items.length) errors.push('Savat bo‘sh');
    cart.items.forEach(item => {
        if (!item.product?.stock || item.quantity > item.product.stock) {
            errors.push(`${item.product.name} uchun zaxira yetarli emas`);
        }
    });
    return { isValid: !errors.length, errors };
}






Natija:

Xavfsiz autentifikatsiya tizimi.
Optimallashtirilgan savat boshqaruvi.
Foydalanuvchi ma‘lumotlari xavfsiz saqlanadi.


Davomiyligi: 3-5 kun



4-bosqich: UI komponentlarini modulli qilish
Maqsad: index-new.html dizaynini saqlagan holda UI komponentlarini qayta ishlab chiqish va optimallashtirish.

Vazifalar:

Toast va Loading komponentlarini alohida fayllarga ko‘chirish:
src/assets/js/components/toast.js:export class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    show(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getTypeIcon(type)} toast-icon"></i>
                <span class="toast-message">${DOMPurify.sanitize(message)}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        this.container.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    getTypeIcon(type) {
        return { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' }[type] || 'info-circle';
    }
}

window.DPL = window.DPL || {};
DPL.simpleToast = new Toast();


src/assets/js/components/loading.js:export class Loading {
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
DPL.simpleLoading = new Loading();




CSS optimallashtirish:
Animatsiyalarni soddalashtirish va will-change qo‘shish:.toast {
    will-change: transform;
    transition: transform 0.3s ease;
}


Mobil qurilmalar uchun optimallashtirish:@media (max-width: 768px) {
    .toast-container {
        left: 0.5rem;
        right: 0.5rem;
        max-width: unset;
    }
}




DOM manipulyatsiyasini optimallashtirish:
DocumentFragment ishlatish:async function renderCategories(categories) {
    const fragment = document.createDocumentFragment();
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `<h3>${DOMPurify.sanitize(category.name)}</h3>`;
        fragment.appendChild(card);
    });
    document.getElementById('categoriesGrid').appendChild(fragment);
}






Natija:

Modulli va qayta ishlatiladigan UI komponentlari.
Tezroq DOM manipulyatsiyasi.
Mobil qurilmalarda yaxshi ishlash.


Davomiyligi: 3-4 kun



5-bosqich: Xavfsizlikni kuchaytirish
Maqsad: XSS va boshqa xavfsizlik xavf-xatarlarini bartaraf qilish.

Vazifalar:

HTML sanitizatsiyasi:
DOMPurify kutubxonasini loyihaga qo‘shish:<script src="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"></script>


Barcha foydalanuvchi kiritmalarini tozalash:function sanitizeInput(input) {
    return DOMPurify.sanitize(input);
}




LocalStorage o‘rniga sessionStorage:
Sensitiv ma‘lumotlarni sessionStorageda saqlash:const Storage = {
    set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
};




CSRF himoyasi:
API so‘rovlariga CSRF token qo‘shish:async post(endpoint, data) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        headers: {
            'X-CSRF-Token': Storage.get('csrf_token'),
            'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}






Natija:

XSS va CSRF hujumlariga qarshi himoya.
Foydalanuvchi ma‘lumotlari xavfsiz saqlanadi.


Davomiyligi: 2-3 kun



6-bosqich: Hujjatlashtirish va sinov
Maqsad: Kod sifatini oshirish va loyihani kelajakda kengaytirishni osonlashtirish.

Vazifalar:

JSDoc bilan hujjatlashtirish:
Har bir sinf va funksiyani hujjatlashtirish:/**
 * Foydalanuvchini autentifikatsiya qiladi
 * @param {Object} credentials - Login ma'lumotlari (email, parol)
 * @returns {Promise<boolean>} - Muvaffaqiyatli bo'lsa true
 */
async handleLogin(credentials) {
    // ...
}




Unit testlarni qo‘shish:
Jest kutubxonasini sozlash:npm install --save-dev jest


Testlar yozish:import { CartManager } from '../src/assets/js/managers/cart.js';

describe('CartManager', () => {
    test('addToCart adds item correctly', async () => {
        const cart = new CartManager();
        await cart.addToCart('123', 1, { showToast: false });
        expect(cart.localCart.items.length).toBe(1);
    });
});




README faylini yangilash:
Loyiha haqida umumiy ma‘lumot, o‘rnatish qo‘llanmasi va API hujjatlarini qo‘shish.




Natija:

Tushunarli va yaxshi hujjatlashtirilgan kod.
Xatolarni oldindan aniqlash imkoniyati.
Yangi ishlab chiquvchilar uchun oson kirish.


Davomiyligi: 3-4 kun



7-bosqich: Sinov va joylashtirish
Maqsad: Loyihani sinovdan o‘tkazish va ishlab chiqarish muhitiga joylashtirish.

Vazifalar:

Funksional sinovlar:
Login, ro‘yxatdan o‘tish, savatga qo‘shish va buyurtma jarayonlarini sinovdan o‘tkazish.
Mobil va desktop qurilmalarda UI sinovlarini o‘tkazish.


Ishlash sinovlari:
Sahifa yuklanish tezligini o‘lchash (masalan, Lighthouse yordamida).
DOM manipulyatsiyasi va API so‘rovlarini optimallashtirish.


Joylashtirish:
Loyihani Vercel, Netlify yoki boshqa platformaga joylashtirish.
CI/CD jarayonini sozlash (masalan, GitHub Actions orqali):name: Deploy
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}






Natija:

To‘liq sinovdan o‘tgan loyiha.
Ishlab chiqarish muhitida barqaror ishlaydigan ilova.


Davomiyligi: 2-3 kun



Umumiy vaqt hisobi

1-bosqich: 2-3 kun
2-bosqich: 3-4 kun
3-bosqich: 3-5 kun
4-bosqich: 3-4 kun
5-bosqich: 2-3 kun
6-bosqich: 3-4 kun
7-bosqich: 2-3 kun
Jami: Taxminan 18-26 kun (jamoa hajmi va tajribasiga qarab)

Xulosa
Ushbu reja index-new.html dizaynini saqlagan holda loyihani modulli, xavfsiz va samarali qilishga yordam beradi. Har bir bosqich aniq vazifalarni o‘z ichiga oladi va loyihaning sifatini oshirishga qaratilgan. Agar qo‘shimcha savollar yoki aniqlik kiritish kerak bo‘lsa, iltimos, so‘rang!