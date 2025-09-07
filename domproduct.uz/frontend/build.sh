#!/bin/bash

# Build script для React frontend с профессиональной структурой
echo "🚀 Начинаем сборку React приложения..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь что вы в директории frontend/"
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Проверяем структуру проекта
echo "🔍 Проверяем структуру проекта..."
if [ ! -d "src/layouts" ]; then
    echo "❌ Ошибка: Директория src/layouts не найдена"
    exit 1
fi

if [ ! -d "src/components/admin" ]; then
    echo "❌ Ошибка: Директория src/components/admin не найдена"
    exit 1
fi

if [ ! -d "src/components/auth" ]; then
    echo "❌ Ошибка: Директория src/components/auth не найдена"
    exit 1
fi

if [ ! -d "src/components/common" ]; then
    echo "❌ Ошибка: Директория src/components/common не найдена"
    exit 1
fi

if [ ! -d "src/components/user" ]; then
    echo "❌ Ошибка: Директория src/components/user не найдена"
    exit 1
fi

echo "✅ Структура проекта проверена успешно"

# Очищаем предыдущую сборку
echo "🧹 Очищаем предыдущую сборку..."
rm -rf ../public/frontend/*

# Проверяем PWA иконки
echo "🎨 Проверяем PWA иконки..."
if [ ! -f "public/pwa-192x192.png" ]; then
    echo "⚠️  Предупреждение: PWA иконка 192x192 не найдена"
fi

if [ ! -f "public/pwa-512x512.png" ]; then
    echo "⚠️  Предупреждение: PWA иконка 512x512 не найдена"
fi

# Запускаем сборку
echo "🏗️ Запускаем Vite сборку..."
npm run build

# Проверяем успешность сборки
if [ $? -eq 0 ]; then
    echo "✅ Сборка завершена успешно!"
    echo "📂 Файлы сборки находятся в: ../public/frontend/"

    # Показываем размеры файлов
    echo "📊 Размеры файлов сборки:"
    ls -lh ../public/frontend/assets/

    # Показываем PWA файлы
    echo ""
    echo "📱 PWA файлы:"
    ls -la ../public/frontend/ | grep -E "(manifest|sw\.js|registerSW|workbox)"

    # Автоматически обновляем Laravel blade файл
    echo ""
    echo "🔧 Обновляем Laravel blade файл..."
    CSS_FILE=$(find ../public/frontend/assets/ -name "index-*.css" -printf "%f\n" | head -1)
    JS_FILE=$(find ../public/frontend/assets/ -name "index-*.js" -printf "%f\n" | head -1)

    if [ ! -z "$CSS_FILE" ] && [ ! -z "$JS_FILE" ]; then
        # Создаем временный файл с обновленными путями
        sed -e "s/index-[^.]*\.css/$CSS_FILE/g" \
            -e "s/index-[^.]*\.js/$JS_FILE/g" \
            ../resources/views/frontend.blade.php > ../resources/views/frontend.blade.php.tmp

        # Заменяем оригинальный файл
        mv ../resources/views/frontend.blade.php.tmp ../resources/views/frontend.blade.php

        echo "✅ Laravel blade файл обновлен:"
        echo "   CSS: $CSS_FILE"
        echo "   JS:  $JS_FILE"
    else
        echo "⚠️  Не удалось найти build файлы для обновления blade"
    fi

    echo ""
    echo "🎉 Приложение готово к использованию!"
    echo "🌐 Доступно по адресу: http://domproduct.uz"
    echo "📱 PWA поддержка включена!"
else
    echo "❌ Ошибка сборки!"
    exit 1
fi
