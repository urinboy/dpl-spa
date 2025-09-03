# 🔧 Yandex API Key Muammolarini Hal Qilish

## Sizning API key: `c1c8b402-7172-4ea6-994f-b259c33363bf`

## Xatolik: "Invalid api key" yoki "Forbidden"

### Yechimlar:

## 1. Yandex Developer Console da tekshirish:
- https://developer.tech.yandex.ru/ ga kiring
- Loyihangizni oching
- "Ключи" bo'limiga o'ting

## 2. API key holatini tekshiring:
- ✅ Key faol (активен) ekanligini tekshiring
- ✅ Quota (лимиты) qolganligini ko'ring
- ✅ Domainlar (домены) to'g'ri sozlanganligini tekshiring

## 3. To'g'ri API ni tanlang:
Sizda **Геосаджест API** bor, lekin bizga **Геокодер API** kerak!

### Kerakli APIlar:
1. **Геокодер** (Geocoder) - koordinatalar ⟷ manzil
2. **JavaScript API** - xaritalar ko'rsatish uchun
3. **HTTP Геокодер** - server requests uchun

## 4. Loyihangizga qo'shimcha APIlar ulash:
1. Yandex Developer console ga kiring
2. Loyihangizni tanlang
3. "Подключить API" tugmasini bosing
4. Quyidagi APIlarni qo'shing:
   - ✅ **Геокодер** (asosiy)
   - ✅ **JavaScript API и HTTP Геокодер**
   - ✅ **Карты**

## 5. Yangi API key olish:
Agar yuqoridagi APIlar yo'q bo'lsa:
1. Yangi loyiha yarating
2. To'g'ri APIlarni ulang
3. Yangi API key oling

## 6. Domain sozlamalari:
API key sozlamalarida quyidagi domainlarni qo'shing:
- `localhost:5174`
- `localhost:5173`
- `127.0.0.1:5174`
- `127.0.0.1:5173`

## 7. Test qilish:
```bash
# Browser dan test (CORS muammosi bo'lmasligi uchun):
# Yandex Developer Console da "Тестирование" bo'limini ishlatng

# Yoki Postman/Insomnia da:
GET https://geocode-maps.yandex.ru/1.x/?format=json&geocode=69.2401,41.2995&results=1&lang=uz&apikey=YOUR_KEY
```

## 8. Alternative yechim - API key siz ishlash:
Yandex ba'zi hollarda API key siz ham ishlaydi, lekin cheklangan.
LocationContext.jsx da key siz rejimni yoqdik.

## Keyingi qadamlar:
1. ✅ Yandex console da APIlarni tekshiring
2. ✅ Kerak bo'lsa yangi key oling  
3. ✅ Domain restrictions sozlang
4. ✅ Browser da test qiling
5. ✅ Loyihada sinab ko'ring

---

## Muqobil yechim - IP Geolocation:
Agar Yandex API ishlamasa, IP orqali joylashuvni aniqlaymiz:
- ipapi.co (bepul 1000/kun)
- ipgeolocation.io (bepul 30,000/oy)

## Fallback system:
1. GPS (eng aniq)
2. Yandex API (shahar/viloyat uchun)
3. IP Geolocation (taxminiy)
4. Manual selection (qo'lda tanlash)

Bu tizim har doim ishlaydi! 🚀
