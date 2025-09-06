# 🔑 API Keys Setup Qo'llanmasi

## 1. Google Maps API Key Olish

### Bosqichma-bosqich yo'riqnoma:

#### A) Google Cloud Console ga kirish
1. https://console.cloud.google.com/ ga o'ting
2. Google hisobingizga kiring
3. Yangi loyiha yarating: "DomProduct Location"

#### B) API larni yoqish
```bash
# Quyidagi API larni qidiring va yoqing:
- Geocoding API
- Maps JavaScript API  
- Places API (ixtiyoriy)
```

#### C) API Key yaratish
```bash
1. "APIs & Services" > "Credentials"
2. "Create Credentials" > "API Key"
3. API key nusxalang
```

#### D) API Key ni cheklash (XAVFSIZLIK!)
```bash
# Application restrictions:
- HTTP referrers (web sites)
- localhost:5173/*
- localhost:3000/*
- yourdomain.com/*

# API restrictions:
- Geocoding API
- Maps JavaScript API
```

#### E) Billing hisobini ulash
```bash
# Google Cloud Console da:
1. "Billing" > "Link a billing account"
2. To'lov kartasini qo'shing
3. $200/oy bepul quota olasiz
```

### Narxlar (2024):
- **Bepul**: 28,500 so'rov/oy
- **Geocoding**: $5 per 1000 so'rov
- **Maps JS**: $7 per 1000 yuklash

---

## 2. Yandex Maps API Key Olish

### Bosqichma-bosqich yo'riqnoma:

#### A) Developer Console ga kirish
1. https://developer.tech.yandex.ru/ ga o'ting
2. Yandex hisobingizga kiring

#### B) Loyiha yaratish
```bash
1. "Мои проекты" > "Создать проект"
2. Nom: "DomProduct Geolocation"
3. Tavsif: "E-commerce location detection"
```

#### C) API larni ulash
```bash
# Kerakli API lar:
- Геокодер (Geocoder)
- JavaScript API
- HTTP Геокодер
```

#### D) API Key olish
```bash
1. Loyiha > "Ключи" 
2. "Получить ключ"
3. Server key va Browser key ni oling
```

### Narxlar (2024):
- **Bepul**: 25,000 so'rov/kun
- **O'zbekiston**: Yuqori limitlar
- **Pullik**: $0.50 per 1000 so'rov

---

## 3. Environment Variables o'rnatish

### Development uchun:
```bash
# .env.development yarating:
VITE_GOOGLE_MAPS_API_KEY=your_google_key_here
VITE_YANDEX_MAPS_API_KEY=your_yandex_key_here
```

### Production uchun:
```bash
# .env.production yarating:
VITE_GOOGLE_MAPS_API_KEY=prod_google_key
VITE_YANDEX_MAPS_API_KEY=prod_yandex_key
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 4. Xavfsizlik Choralari

### ✅ Qilish kerak:
- API keylarni environment variables da saqlash
- Domain restrictions qo'yish
- .env fayllarni .gitignore ga qo'shish
- Usage limits o'rnatish
- Monitoring yoqish

### ❌ Qilmaslik kerak:
- API keylarni kodda yozish
- Public repositories ga yuklash
- Cheksiz access berish
- Backup fayllarni commit qilish

---

## 5. Test Qilish

### Google API test:
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?latlng=41.2995,69.2401&key=YOUR_KEY"
```

### Yandex API test:
```bash
curl "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=69.2401,41.2995&apikey=YOUR_KEY"
```

---

## 6. Monitoring va Analytics

### Google Cloud Console:
- API usage statistics
- Error monitoring  
- Cost tracking
- Alert notifications

### Yandex Developer:
- Request statistics
- Error logs
- Usage analytics

---

## 7. Troubleshooting

### Keng uchraydigan xatoliklar:

#### "API key not valid"
```bash
# Yechim:
1. API key ni tekshiring
2. Domain restrictions ni ko'rib chiqing
3. API status ni tekshiring
```

#### "Quota exceeded"
```bash
# Yechim:
1. Billing account tekshiring
2. Daily limits ko'ring
3. Usage optimization qiling
```

#### "CORS error"
```bash
# Yechim:
1. HTTP referrers sozlang
2. HTTPS ishlatong (production da)
3. Domain restrictions tekshiring
```

---

## 8. Alternative APIs

### Backup IP Geolocation:
- **ipapi.co**: 1000/kun bepul
- **ipgeolocation.io**: 30,000/oy bepul  
- **ipstack.com**: 10,000/oy bepul

### Open Source Alternative:
- **OpenStreetMap Nominatim**: Cheksiz bepul
- **MapBox**: 50,000/oy bepul
- **HERE Maps**: Developer account kerak

---

## 🚀 Production Deploy Checklist

- [ ] API keylar production environment da o'rnatilgan
- [ ] Domain restrictions sozlangan  
- [ ] HTTPS ishlatilayapti
- [ ] Monitoring o'rnatilgan
- [ ] Error handling ishlayapti
- [ ] Rate limiting ishlatilayapti
- [ ] Backup API lar sozlangan
- [ ] Security headers qo'shilgan
