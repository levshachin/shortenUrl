document.addEventListener('DOMContentLoaded', (event) => {
    const themeToggle = document.getElementById('theme');
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    const header = document.querySelector('.theme-header');
    const footer = document.querySelector('.theme-footer');
    const mainFunction = document.querySelector('.mainFunction');

    // Проверяем текущую тему при загрузке страницы
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-theme');
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
        // Переключаем тему
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Переключаем видимость иконок
        lightIcon.style.display = isDark ? 'none' : 'block';
        darkIcon.style.display = isDark ? 'block' : 'none';
    });
});

async function shortenURL() {
    const input = document.getElementById('urlInput');
    const output = document.getElementById('shortenedURL');
    const urlToShorten = input.value;

    if (!urlToShorten) {
        alert('Пожалуйста, введите URL для сокращения.');
        return;
    }

    // Можно добавить здесь индикатор загрузки
    output.textContent = 'Сокращаем...';
    console.log('Хуй')

    try {
        const response = await fetch('/api/short', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalUrl: urlToShorten })
        });
        
        const data = await response.json();
        console.log('data')
        if (data && data.shortUrl) {
            output.textContent = data.shortUrl;
        } else {
            output.textContent = 'Ошибка при сокращении ссылки.';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        output.textContent = 'Произошла ошибка при сокращении ссылки.';
    }
}

async function copyToClipboard() {
    const output = document.getElementById('shortenedURL');
    const text = output.textContent;

    if (!text) {
        alert('Нет ссылки для копирования.');
        return;
    }

    // Проверка поддержки Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            alert('Ссылка скопирована в буфер обмена!');
        } catch (err) {
            console.error('Ошибка при копировании: ', err);
            alert('Не удалось скопировать.');
        }
    } else {
        // Если не поддерживается или не безопасный контекст, используем временный textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert('Ссылка скопирована в буфер обмена!');
            } else {
                alert('Не удалось скопировать.');
            }
        } catch (err) {
            console.error('Ошибка при копировании через execCommand: ', err);
            alert('Не удалось скопировать.');
        }
        document.body.removeChild(textarea);
    }
}