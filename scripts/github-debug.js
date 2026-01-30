// GitHub Pages Debugging Helper
(function() {
    'use strict';
    
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        console.log('🔧 GitHub Pages Debug Mode Active');
        
        // Check for common issues
        const checks = {
            'HTTPS Required': window.location.protocol === 'https:',
            'Console Errors': window.console && console.error,
            'Script Loading': document.scripts.length > 0,
            'CSS Loading': document.styleSheets.length > 0,
            'Local Storage': typeof Storage !== 'undefined'
        };
        
        console.table(checks);
        
        // Add visual indicator
        const debugIndicator = document.createElement('div');
        debugIndicator.id = 'github-pages-debug';
        debugIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2e5939;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        debugIndicator.textContent = 'GitHub Pages: Active';
        document.body.appendChild(debugIndicator);
        
        // Remove indicator after 5 seconds
        setTimeout(() => {
            debugIndicator.style.opacity = '0';
            debugIndicator.style.transition = 'opacity 0.5s';
            setTimeout(() => debugIndicator.remove(), 500);
        }, 5000);
    }
    
    // Enhanced error reporting
    window.addEventListener('error', function(e) {
        if (isGitHubPages) {
            console.error('🌐 GitHub Pages Error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
        }
    });
    
    // Check for resource loading issues
    document.addEventListener('DOMContentLoaded', function() {
        // Check all images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                console.warn('⚠️ Image failed to load:', this.src);
                // Try to load a fallback
                if (this.src.includes('images/')) {
                    const fallbackSrc = this.src.replace('images/', './images/');
                    if (this.src !== fallbackSrc) {
                        this.src = fallbackSrc;
                    }
                }
            });
        });
        
        // Check all scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            script.addEventListener('error', function() {
                console.warn('⚠️ Script failed to load:', this.src);
            });
        });
    });
    
})();