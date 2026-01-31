// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Dark mode script loaded');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    console.log('🔍 Theme toggle element:', themeToggle);
    console.log('🔍 Theme icon element:', themeIcon);
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    if (savedTheme === 'dark' || (savedTheme === 'auto' && systemPrefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add visual feedback
            this.style.transform = 'rotate(30deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                themeIcon.title = 'Switch to light mode';
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                themeIcon.title = 'Switch to dark mode';
            }
        }
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    // Add keyboard accessibility
    if (themeToggle) {
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
});