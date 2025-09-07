const fs = require('fs');

const filePath = '/var/www/domproduct.uz/frontend/src/data/products.js';

// Читаем файл
let content = fs.readFileSync(filePath, 'utf8');

// Заменяем все placeholder URLs
content = content.replace(/image: 'https:\/\/via\.placeholder\.com\/[^']*'/g, "image: '/images/placeholder.svg'");

// Записываем обновленный файл
fs.writeFileSync(filePath, content);

console.log('✅ Все изображения заменены на локальные!');
