# 🏪 DOM Product - React Frontend

Замонавий React + Vite билан ишлаб чиқилган веб-илова frontend қисми.

## 📁 Лойиҳа структураси

```
src/
├── assets/                 # Статик активлар
│   ├── images/             # Расмлар
│   ├── icons/              # Иконкалар  
│   └── styles/             # Глобал CSS файллар
│       ├── AdminDashboard.css
│       └── AdminUsers.css
│
├── components/             # React компонентлари
│   ├── admin/              # Админ компонентлари
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminPanel.jsx
│   │   └── AdminUsers.jsx
│   ├── auth/               # Аутентификация компонентлари
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── common/             # Умумий компонентлар
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   └── user/               # Фойдаланувчи компонентлари
│       └── Dashboard.jsx
│
├── contexts/               # React Context'лар
│   └── AuthContext.jsx     # Аутентификация контексти
│
├── hooks/                  # Custom React hooks
│   ├── useApi.js           # API сўровлари учун hook
│   ├── useDebounce.js      # Debounce hook
│   └── useLocalStorage.js  # LocalStorage hook
│
├── layouts/                # Саҳифа лейаутлари
│   ├── AdminLayout.jsx     # Админ лейауити
│   ├── AdminLayout.css
│   ├── AuthLayout.jsx      # Аутентификация лейауити
│   ├── AuthLayout.css
│   ├── UserLayout.jsx      # Фойдаланувчи лейауити
│   └── UserLayout.css
│
├── pages/                  # Саҳифалар (Route компонентлари)
│   ├── admin/              # Админ саҳифалари
│   ├── auth/               # Аутентификация саҳифалари
│   │   ├── LoginPage.jsx
│   │   └── LoginPage.css
│   └── user/               # Фойдаланувчи саҳифалари
│
├── services/               # API хизматлари
│   └── api.js              # Асосий API хизмати
│
├── utils/                  # Утилита функциялари
│   ├── constants.js        # Константалар
│   └── helpers.js          # Ёрдамчи функциялар
│
├── App.jsx                 # Асосий App компоненти
├── App.css                 # App стиллари
├── main.jsx                # Entry point
└── index.css               # Глобал стиллар
```

## 🎯 Архитектура принциплари

### 📦 **Компонент ташкилоти**
- `components/admin/` - Фақат админлар учун компонентлар
- `components/user/` - Фойдаланувчилар учун компонентлар  
- `components/common/` - Барча учун умумий компонентлар
- `components/auth/` - Аутентификация учун компонентлар

### 🎨 **Лейаут тизими**
- `AdminLayout` - Админ панели учун
- `UserLayout` - Фойдаланувчилар учун (Header + Footer)
- `AuthLayout` - Кириш/Рўйхат саҳифалари учун

### 📄 **Саҳифалар vs Компонентлар**
- `pages/` - Route'ларга мос келадиган саҳифалар
- `components/` - Қайта ишлатиладиган компонентлар

### 🛠 **Хизматлар ва утилиталар**
- `services/` - API билан боғланиш
- `hooks/` - React hooks (useApi, useDebounce, useLocalStorage)
- `utils/` - Утилита функциялари ва константалар
- `contexts/` - React Context'лар

## 🚀 Ишлатиш

### Development режими
```bash
npm run dev
```

### Сборка для продакшена
```bash
# Использовать build script (рекомендуется)
./build.sh

# Или напрямую через npm
npm run build
```

Build script автоматически:
- ✅ Проверяет структуру проекта
- ✅ Устанавливает зависимости при необходимости
- ✅ Очищает предыдущую сборку
- ✅ Запускает Vite build
- ✅ Показывает статистику файлов

### Laravel bilan интеграция
```bash
# Auto build script
./build-frontend.sh
```

## 🔧 Технологиялар

- **React 18** - UI library
- **Vite** - Build tool  
- **React Router DOM** - Routing
- **CSS3** - Styling (Custom CSS)
- **Modern JavaScript (ES6+)**

## 📱 Features

### ✅ **Тайёр компонентлар**
- Аутентификация (Login/Register)
- Админ дашборди
- Фойдаланувчилар бошқаруви
- Responsive дизайн

### 🎨 **Дизайн тизими**
- Gradient фонлар
- Ҳовер эффектлар
- Backdrop filter эффектлар
- Mobile-first responsive дизайн

### 🔐 **Хавфсизлик**
- JWT token аутентификация
- Role-based доступ назорати
- Админ/фойдаланувчи ажратиш

## 📊 Келгуси лойиҳалар

- [ ] AdminLanguages компоненти
- [ ] Маҳсулотлар бошқаруви
- [ ] Буюртмалар тизими
- [ ] Статистика дашборди
- [ ] Файл юклаш тизими

## 🤝 Ҳамкорлик

Лойиҳани ривожлантиришда қатнашиш учун:
1. Янги компонент яратишдан олдин structure га амал қилинг
2. CSS файлларни `assets/styles/` га жойлаштиринг  
3. Утилита функцияларни `utils/` дан фойдаланинг
4. Custom hooks ларни `hooks/` га қўшинг

---
*DOM Product Team 🏪*
