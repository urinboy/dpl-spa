# Yandex Maps API Key Olish Qo'llanmasi

## 1. Yandex Developer Console ga kirish
1. https://developer.tech.yandex.ru/ ga o'ting
2. Yandex hisobingizga kiring yoki yangi hisobingizni yarating

## 2. Yangi loyiha yaratish
1. "Мои проекты" bo'limiga o'ting
2. "Создать проект" tugmasini bosing
3. Loyiha nomini kiriting: "DomProduct Location"
4. Tavsifni yozing va "Создать" ni bosing

## 3. API Service larni ulash
1. Yangi yaratilgan loyihani oching
2. "Подключить API" tugmasini bosing
3. Quyidagi API larni tanlang:
   - **Геокодер** (koordinatalardan manzil olish uchun)
   - **JavaScript API и HTTP Геокодер** (web uchun)
   - **Карты** (xarita ko'rsatish uchun)

## 4. API Key olish
1. Loyihaga o'tgandan keyin "Ключи" bo'limiga o'ting
2. "Получить ключ" tugmasini bosing
3. Server API key va Browser API key larni alohida oling

## 5. Domainlarni cheklash
1. API key sozlamalariga o'ting
2. "Ограничения" bo'limida:
   - HTTP referer larni qo'shing:
     * http://localhost:5173/*
     * http://localhost:3000/*
     * https://yourdomain.com/*

## Narxlar (2024):
- **BEPUL**: 25,000 so'rov/kun (Geocoder uchun)
- **Pullik**: 1000 so'rov uchun $0.50
- O'zbekiston, Rossiya va MDH davlatlarida bepul limitlar yuqoriroq

## API endpoints:
- Geocoder: https://geocode-maps.yandex.ru/1.x/
- Static API: https://static-maps.yandex.ru/1.x/
- JavaScript API: https://api-maps.yandex.ru/2.1/

## Test qilish:
curl "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=69.240073,41.299496&results=1&lang=uz"
