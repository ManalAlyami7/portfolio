// theme-initializer.js - Prevent dark mode flicker and initialize theme
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = (savedTheme === 'dark' || (savedTheme === 'auto' && systemPrefersDark)) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
})();