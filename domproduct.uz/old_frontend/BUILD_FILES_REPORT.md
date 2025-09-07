# 📁 Build qilingan fayllar yo'li hisoboti

## 🎯 Build manzili
```
/var/www/domproduct.uz/public/frontend/
```

## 📊 Build fayllar tafsiloti

### 🎨 CSS Fayllar
```
📍 Yo'l: /var/www/domproduct.uz/public/frontend/assets/index-Bykgqh4C.css
📏 Hajmi: 48.36 KB (9.37 KB gzipped)
🔗 Laravel URL: {{ asset('frontend/assets/index-Bykgqh4C.css') }}
🌐 Browser URL: http://domproduct.uz/frontend/assets/index-Bykgqh4C.css
```

### ⚡ JavaScript Fayllar
```
📍 Yo'l: /var/www/domproduct.uz/public/frontend/assets/index-bo4Br32V.js
📏 Hajmi: 253.27 KB (77.95 KB gzipped)
🔗 Laravel URL: {{ asset('frontend/assets/index-bo4Br32V.js') }}
🌐 Browser URL: http://domproduct.uz/frontend/assets/index-bo4Br32V.js
```

### 🖼️ Assets Fayllar
```
📍 React Logo: /var/www/domproduct.uz/public/frontend/assets/react-CHdo91hT.svg
📏 Hajmi: 4.13 KB (2.05 KB gzipped)
🔗 Laravel URL: {{ asset('frontend/assets/react-CHdo91hT.svg') }}
```

### 📱 PWA Fayllar
```
📍 Manifest: /var/www/domproduct.uz/public/frontend/manifest.webmanifest
📍 Service Worker: /var/www/domproduct.uz/public/frontend/sw.js
📍 Register SW: /var/www/domproduct.uz/public/frontend/registerSW.js
📍 Workbox: /var/www/domproduct.uz/public/frontend/workbox-5ffe50d4.js
```

### 🎨 PWA Ikonkalar
```
📍 192x192: /var/www/domproduct.uz/public/frontend/pwa-192x192.png
📍 512x512: /var/www/domproduct.uz/public/frontend/pwa-512x512.png
```

### 📄 HTML Fayl
```
📍 Yo'l: /var/www/domproduct.uz/public/frontend/index.html
📏 Hajmi: 0.58 KB (0.35 KB gzipped)
🔗 Laravel URL: {{ asset('frontend/index.html') }}
```

## 🔧 Laravel Blade integratsiyasi

### 📝 Yangilangan `/resources/views/frontend.blade.php`:
```blade
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'DOM Product') }}</title>

    <!-- React Vite Build файллари -->
    <link rel="stylesheet" crossorigin href="{{ asset('frontend/assets/index-Bykgqh4C.css') }}">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- API Base URL -->
    <meta name="api-base-url" content="{{ config('app.url') }}/api/v1">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('frontend/vite.svg') }}">
</head>
<body>
    <!-- React App Root -->
    <div id="root"></div>

    <!-- React Vite Build скрипт -->
    <script type="module" crossorigin src="{{ asset('frontend/assets/index-bo4Br32V.js') }}"></script>
</body>
</html>
```

## 🎯 Browser'da ochish

### Direct URLs:
- **🏠 Main App**: http://domproduct.uz
- **🎨 CSS File**: http://domproduct.uz/frontend/assets/index-Bykgqh4C.css
- **⚡ JS File**: http://domproduct.uz/frontend/assets/index-bo4Br32V.js
- **📱 PWA Manifest**: http://domproduct.uz/frontend/manifest.webmanifest

## 📊 File Structure
```
/var/www/domproduct.uz/public/frontend/
├── 📄 index.html                    (0.58 KB)
├── 📱 manifest.webmanifest          (0.45 KB)
├── ⚙️  registerSW.js                (0.13 KB)
├── 🔧 sw.js                         (1.47 KB)
├── 🔧 workbox-5ffe50d4.js          (15.03 KB)
├── 🖼️ pwa-192x192.png              
├── 🖼️ pwa-512x512.png              
├── 🖼️ vite.svg                     
├── 📄 PWA_ICONS.md                  
└── 📁 assets/
    ├── 🎨 index-Bykgqh4C.css       (48.36 KB)
    ├── ⚡ index-bo4Br32V.js        (253.27 KB) 
    └── 🖼️ react-CHdo91hT.svg       (4.13 KB)
```

## ⚡ Performance
```
📊 Total Bundle Size: 
├── Uncompressed: 303.68 KB
├── Gzipped: ~87 KB 
└── Load Time: ~1-2 seconds (3G connection)
```

## 🔄 Auto-update process

Har safar `./build.sh` ishga tushganda:
1. 🧹 Eski fayllar o'chiriladi
2. 🏗️ Yangi fayllar yaratiladi (hash bilan)
3. 📝 Yangi fayl nomlarini blade faylga qo'yish kerak

## 💡 Qo'llanma

### Build fayl nomlarini topish:
```bash
ls -la /var/www/domproduct.uz/public/frontend/assets/
```

### Blade faylni yangilash:
```bash
# CSS faylni topish
find /var/www/domproduct.uz/public/frontend/assets/ -name "index-*.css"

# JS faylni topish  
find /var/www/domproduct.uz/public/frontend/assets/ -name "index-*.js"
```
