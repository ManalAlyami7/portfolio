// font-loader.js - Handle Font Awesome loading and tracking prevention mitigation
function loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    
    link.onerror = function() {
        console.warn('⚠️ Font Awesome failed to load, using fallbacks');
        // Add fallback CSS for common icons
        const fallbackCSS = `
            .fa-github:before { content: "GH"; }
            .fa-linkedin:before { content: "LI"; }
            .fa-envelope:before { content: "📧"; }
            .fa-download:before { content: "⬇️"; }
            .fa-external-link-alt:before { content: "↗️"; }
            .fa-moon:before { content: "🌙"; }
            .fa-sun:before { content: "☀️"; }
            .fa-award:before { content: "🏆"; }
            .fa-trophy:before { content: "🏅"; }
            .fa-building:before { content: "🏢"; }
            .fa-robot:before { content: "🤖"; }
            .fa-car:before { content: "🚗"; }
            .fa-dumbbell:before { content: "💪"; }
            .fa-brain:before { content: "🧠"; }
            .fa-book:before { content: "📖"; }
            .fa-home:before { content: "🏠"; }
            .fa-music:before { content: "🎵"; }
            .fa-cloud-sun:before { content: "☀️"; }
            .fa-heartbeat:before { content: "❤️"; }
            .fa-user-graduate:before { content: "🎓"; }
            .fa-chart-line:before { content: "📈"; }
            .fa-code:before { content: "</>"; }
            .fa-laptop-code:before { content: "💻"; }
            .fa-mobile-alt:before { content: "📱"; }
            .fa-database:before { content: "🗄️"; }
            .fa-server:before { content: "🖥️"; }
            .fa-shield-alt:before { content: "🛡️"; }
            .fa-bug:before { content: "🐛"; }
            .fa-tools:before { content: "🛠️"; }
            .fa-cogs:before { content: "⚙️"; }
        `;
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
    };
    
    link.onload = function() {
        console.log('✅ Font Awesome loaded successfully');
    };
    
    document.head.appendChild(link);
}

// Load Font Awesome after DOM is ready to handle tracking prevention
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFontAwesome);
} else {
    loadFontAwesome();
}