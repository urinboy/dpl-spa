# 🛒 DomProduct.uz - E-commerce Platform

Modern, responsive e-commerce platform built with React and Vite, featuring multi-language support and advanced location detection.

## 🚀 Features

- **Multi-language Support**: Uzbek, Russian, English
- **Responsive Design**: Mobile-first approach with glass morphism UI
- **Location Detection**: Smart GPS and manual city selection
- **Professional Onboarding**: Step-by-step user introduction
- **Advanced Search**: Product search with filters
- **Cart & Wishlist**: Complete shopping experience
- **PWA Ready**: Service workers and offline support

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0, Vite 7.0.5
- **Internationalization**: i18next
- **State Management**: React Context API
- **Styling**: CSS with CSS variables and responsive design
- **Build Tool**: Vite with Hot Module Replacement

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/urinboy/dpl-spa.git
cd dpl-spa/domproduct.uz

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Multi-language Support

The platform supports 3 languages with comprehensive city translations:

| Feature | Uzbek | Russian | English |
|---------|-------|---------|---------|
| Interface | ✅ | ✅ | ✅ |
| Cities (15) | ✅ | ✅ | ✅ |
| Error Messages | ✅ | ✅ | ✅ |

## 📍 Location System

Advanced location detection with multiple fallback strategies:

1. **GPS Detection** - High accuracy via browser geolocation
2. **IP-based Detection** - Approximate location via IP
3. **Manual Selection** - User-driven city selection
4. **Smart Fallback** - Automatic error handling

### Supported Cities:
- Toshkent/Tashkent/Ташкент
- Samarqand/Samarkand/Самарканд
- Buxoro/Bukhara/Бухара
- And 12 more major cities...

## 🎨 Design System

- **Glass Morphism UI** - Modern transparent design
- **Responsive Breakpoints** - 5-tier responsive system
- **Professional Animations** - Smooth transitions and loading states
- **Consistent Typography** - Optimized for readability

## 📱 Mobile Experience

- **Mobile-first Design** - Optimized for mobile devices
- **Touch-friendly Interface** - Large touch targets
- **Fast Loading** - Optimized bundle sizes
- **Offline Support** - Service worker integration

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Route components
├── contexts/       # React Context providers
├── data/           # Static data and translations
├── utils/          # Utility functions
├── assets/         # Static assets and CSS
├── hooks/          # Custom React hooks
└── services/       # API services (planned)
```

## 📋 Current Version: v1.4.5

### Recent Updates:
- ✅ Enhanced splash screen with custom loading animation
- ✅ Responsive header optimization with 5-tier breakpoint system
- ✅ Location display cleanup (removed ", Shahar markazi")
- ✅ Multi-language city translation system
- ✅ Professional footer with payment methods

## 🚀 Upcoming Features

See [LOCATION_OPTIMIZATION_PLAN.md](./LOCATION_OPTIMIZATION_PLAN.md) for detailed roadmap.

### Phase 3 (In Planning):
- API integration layer
- Advanced geolocation hooks
- Enhanced error handling
- Location caching system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

**UrinboyDev** - [urinboydev.uz](https://urinboydev.uz)

---

Built with ❤️ in Uzbekistan
