# 📱 PWA (Progressive Web App) Support

## ✅ Что настроено

### 1. Vite PWA Plugin
- Автоматическая регистрация Service Worker
- Offline кэширование
- Автоматические обновления приложения

### 2. Web App Manifest
```json
{
  "name": "Dom Product",
  "short_name": "DPL", 
  "description": "Dom Product - O`zbekistondagi eng yaxshi onlayn do`kon.",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

### 3. PWA иконки
- 📱 pwa-192x192.png (192x192 px)
- 📱 pwa-512x512.png (512x512 px)
- 🎭 Maskable icon support

### 4. Service Worker
- Автоматическое кэширование ресурсов
- Работа в offline режиме
- Автоматические обновления контента

## 🔧 Файлы сборки

После сборки в `../public/frontend/` создаются:

```
📂 PWA файлы:
├── manifest.webmanifest     # Web App Manifest
├── registerSW.js           # Регистрация Service Worker
├── sw.js                   # Service Worker
├── workbox-*.js            # Workbox library
├── pwa-192x192.png         # PWA иконка 192x192
└── pwa-512x512.png         # PWA иконка 512x512
```

## 🚀 Использование

### Установка как приложение
1. Откройте сайт в браузере
2. Браузер предложит "Установить приложение"
3. Подтвердите установку
4. Приложение появится на рабочем столе

### Offline работа
- Приложение кэширует основные ресурсы
- Работает даже без интернета
- Автоматически синхронизируется при подключении

### Автообновления
- Service Worker автоматически проверяет обновления
- Новые версии устанавливаются в фоновом режиме
- Пользователь получает уведомление о доступности обновления

## 🎨 Настройка иконок

### Замена временных иконок
Текущие иконки - это копии vite.svg. Для продакшена нужно заменить их на:

1. **Создание иконок**
   ```bash
   # Создайте PNG иконки с размерами:
   # - 192x192 px для pwa-192x192.png
   # - 512x512 px для pwa-512x512.png
   ```

2. **Размещение**
   ```bash
   cp your-192x192-icon.png /var/www/domproduct.uz/frontend/public/pwa-192x192.png
   cp your-512x512-icon.png /var/www/domproduct.uz/frontend/public/pwa-512x512.png
   ```

3. **Пересборка**
   ```bash
   cd /var/www/domproduct.uz/frontend
   ./build.sh
   ```

## 📊 Конфигурация Vite

```javascript
VitePWA({
  registerType: 'autoUpdate',      // Автообновления
  injectRegister: 'auto',          // Автоматическая регистрация SW
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']  // Кэшируемые файлы
  },
  manifest: {
    // Настройки Web App Manifest
  }
})
```

## 🔍 Проверка PWA

### В браузере
1. Откройте DevTools (F12)
2. Вкладка "Application" 
3. Секция "Service Workers" - проверьте регистрацию
4. Секция "Manifest" - проверьте манифест

### Lighthouse
1. Откройте DevTools
2. Вкладка "Lighthouse"
3. Выберите "Progressive Web App"
4. Запустите аудит

### PWA тестирование
- ✅ Service Worker зарегистрирован
- ✅ Web App Manifest корректен
- ✅ Иконки доступны
- ✅ Https/localhost (для полной функциональности)
- ✅ Offline функциональность

## 🌟 Преимущества PWA

### Для пользователей
- 📱 Установка как нативное приложение
- 🚀 Быстрая загрузка
- 💾 Работа offline
- 🔄 Автоматические обновления
- 📲 Push уведомления (при необходимости)

### Для разработчиков  
- 🛠️ Единая кодовая база
- 📈 Лучшие метрики производительности
- 🔍 Индексирование поисковыми системами
- 💰 Меньше затрат на разработку

## 🚀 Развертывание

PWA требует HTTPS для полной функциональности:

```bash
# Для продакшена обязательно используйте HTTPS
# Или разрабатывайте на localhost
```

## 📝 Заметки

- Service Worker работает только на HTTPS или localhost
- Иконки должны быть в формате PNG
- Manifest автоматически генерируется при сборке
- Кэш очищается автоматически при обновлениях
