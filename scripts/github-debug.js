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