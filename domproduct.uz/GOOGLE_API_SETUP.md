# Google Maps API Key Olish Qo'llanmasi

## 1. Google Cloud Console ga kirish
1. https://console.cloud.google.com/ ga o'ting
2. Google hisobingizga kiring
3. Yangi loyiha yarating yoki mavjudini tanlang

## 2. Google Maps API ni yoqish
1. "APIs & Services" > "Library" ga o'ting
2. Quyidagi API larni qidiring va yoqing:
   - Maps JavaScript API
   - Geocoding API
   - Places API (ixtiyoriy)
   - Maps Static API (ixtiyoriy)

## 3. API Key yaratish
1. "APIs & Services" > "Credentials" ga o'ting
2. "Create Credentials" > "API Key" ni bosing
3. API key nusxalanadi

## 4. API Key ni cheklash (MUHIM!)
1. Yangi yaratilgan API key ustiga bosing
2. "API restrictions" bo'limida:
   - "Restrict key" ni tanlang
   - Kerakli API larni belgilang:
     * Geocoding API
     * Maps JavaScript API
3. "Application restrictions" bo'limida:
   - "HTTP referrers (web sites)" ni tanlang
   - Quyidagi domainlarni qo'shing:
     * localhost:5173/*
     * localhost:3000/*
     * yourdomain.com/*
4. "Save" tugmasini bosing

## 5. Billing hisobini ulash (MUHIM!)
1. Google Cloud Console da "Billing" ga o'ting
2. To'lov kartasini ulang (bepul quota: $200/oy)
3. Billing accountni loyihaga bog'lang

## Oylik narxlar (2024):
- Geocoding API: $5 per 1000 so'rov (oy davomida 200$ bepul)
- Maps JavaScript API: $7 per 1000 yuklash
- Bepul quota: 28,500 so'rov/oy (Geocoding uchun)

## Test qilish:
curl "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.7831,72.3442&key=YOUR_API_KEY"
