const fs = require('fs');
const path = require('path');

const frontendDir = '/var/www/domproduct.uz/frontend/src';

// Функция для рекурсивного поиска всех .jsx файлов
function findJsxFiles(dir) {
    let files = [];
    const dirContent = fs.readdirSync(dir);

    for (const item of dirContent) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files = files.concat(findJsxFiles(fullPath));
        } else if (item.endsWith('.jsx')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Находим все JSX файлы
const jsxFiles = findJsxFiles(frontendDir);

// Паттерн для поиска и замены небезопасных innerHTML операций
const dangerousPattern = /e\.target\.parentElement\.innerHTML = /g;
const safeReplacement = 'if (e.target.parentElement) { e.target.parentElement.innerHTML = ';

let fixedFiles = 0;

jsxFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Заменяем небезопасные операции
        content = content.replace(
            /e\.target\.parentElement\.innerHTML = ([^;]+;)/g,
            'if (e.target.parentElement) { e.target.parentElement.innerHTML = $1 }'
        );

        // Записываем только если были изменения
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Исправлен файл: ${filePath}`);
            fixedFiles++;
        }
    } catch (error) {
        console.error(`❌ Ошибка в файле ${filePath}:`, error.message);
    }
});

console.log(`\n🎉 Исправлено файлов: ${fixedFiles}`);
