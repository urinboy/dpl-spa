#!/bin/bash

# Script to show build file paths and URLs
echo "📁 DOM Product - Build fayllar yo'llari"
echo "========================================"

# Check if build directory exists
if [ ! -d "/var/www/domproduct.uz/public/frontend" ]; then
    echo "❌ Build papkasi topilmadi! Avval ./build.sh ishga tushiring."
    exit 1
fi

echo ""
echo "📍 Build joylashuvi:"
echo "/var/www/domproduct.uz/public/frontend/"

echo ""
echo "🎨 CSS Fayl:"
CSS_FILE=$(find /var/www/domproduct.uz/public/frontend/assets/ -name "index-*.css" -printf "%f\n" 2>/dev/null | head -1)
if [ ! -z "$CSS_FILE" ]; then
    echo "   📄 Fayl: $CSS_FILE"
    echo "   📍 To'liq yo'l: /var/www/domproduct.uz/public/frontend/assets/$CSS_FILE"
    echo "   🔗 Laravel URL: {{ asset('frontend/assets/$CSS_FILE') }}"
    echo "   🌐 Browser URL: http://domproduct.uz/frontend/assets/$CSS_FILE"
    echo "   📏 Hajmi: $(du -h /var/www/domproduct.uz/public/frontend/assets/$CSS_FILE | cut -f1)"
else
    echo "   ❌ CSS fayl topilmadi"
fi

echo ""
echo "⚡ JavaScript Fayl:"
JS_FILE=$(find /var/www/domproduct.uz/public/frontend/assets/ -name "index-*.js" -printf "%f\n" 2>/dev/null | head -1)
if [ ! -z "$JS_FILE" ]; then
    echo "   📄 Fayl: $JS_FILE"
    echo "   📍 To'liq yo'l: /var/www/domproduct.uz/public/frontend/assets/$JS_FILE"
    echo "   🔗 Laravel URL: {{ asset('frontend/assets/$JS_FILE') }}"
    echo "   🌐 Browser URL: http://domproduct.uz/frontend/assets/$JS_FILE"
    echo "   📏 Hajmi: $(du -h /var/www/domproduct.uz/public/frontend/assets/$JS_FILE | cut -f1)"
else
    echo "   ❌ JavaScript fayl topilmadi"
fi

echo ""
echo "🖼️  Assets Fayllar:"
REACT_SVG=$(find /var/www/domproduct.uz/public/frontend/assets/ -name "react-*.svg" -printf "%f\n" 2>/dev/null | head -1)
if [ ! -z "$REACT_SVG" ]; then
    echo "   📄 React Logo: $REACT_SVG"
    echo "   🌐 URL: http://domproduct.uz/frontend/assets/$REACT_SVG"
fi

echo ""
echo "📱 PWA Fayllar:"
if [ -f "/var/www/domproduct.uz/public/frontend/manifest.webmanifest" ]; then
    echo "   📄 Manifest: manifest.webmanifest"
    echo "   🌐 URL: http://domproduct.uz/frontend/manifest.webmanifest"
fi

if [ -f "/var/www/domproduct.uz/public/frontend/sw.js" ]; then
    echo "   📄 Service Worker: sw.js"
    echo "   🌐 URL: http://domproduct.uz/frontend/sw.js"
fi

echo ""
echo "🎯 Laravel Blade fayl:"
echo "   📍 Yo'l: /var/www/domproduct.uz/resources/views/frontend.blade.php"
echo "   🔧 Status: $(if [ -f "/var/www/domproduct.uz/resources/views/frontend.blade.php" ]; then echo "✅ Mavjud"; else echo "❌ Topilmadi"; fi)"

echo ""
echo "📊 Jami hajm:"
TOTAL_SIZE=$(du -sh /var/www/domproduct.uz/public/frontend/ | cut -f1)
echo "   📁 Build papkasi: $TOTAL_SIZE"

echo ""
echo "🌐 Live URLs:"
echo "   🏠 Main App: http://domproduct.uz"
echo "   📱 PWA Manifest: http://domproduct.uz/frontend/manifest.webmanifest"

# Check if files are accessible
echo ""
echo "🔍 Fayl mavjudligi tekshiruvi:"
if curl -s --head http://domproduct.uz/frontend/assets/$CSS_FILE | head -n 1 | grep -q "200 OK"; then
    echo "   ✅ CSS fayl browser orqali ochiladi"
else
    echo "   ❌ CSS fayl browser orqali ochilmaydi"
fi

if curl -s --head http://domproduct.uz/frontend/assets/$JS_FILE | head -n 1 | grep -q "200 OK"; then
    echo "   ✅ JS fayl browser orqali ochiladi"
else
    echo "   ❌ JS fayl browser orqali ochilmaydi"
fi

echo ""
echo "✅ Build fayllar hisoboti tugadi!"
