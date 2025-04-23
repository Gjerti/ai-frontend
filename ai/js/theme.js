document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on system preference
    if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.textContent = '☀️';
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeSwitch.textContent = '🌙';
    }

    // Handle theme switch button click
    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        themeSwitch.textContent = newTheme === 'light' ? '🌙' : '☀️';

        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeSwitch.textContent = savedTheme === 'light' ? '��' : '☀️';
    }
}); 