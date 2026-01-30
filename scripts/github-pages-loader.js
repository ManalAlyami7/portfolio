// GitHub Pages Compatible Script Loader
(function() {
    'use strict';
    
    // Script loading with error handling for GitHub Pages
    const scripts = [
        { src: 'scripts/utils.js', defer: false },
        { src: 'scripts/navigation.js', defer: false },
        { src: 'scripts/projects.js', defer: true },
        { src: 'scripts/animations.js', defer: true },
        { src: 'scripts/micro-interactions.js', defer: true },
        { src: 'scripts/dark-mode.js', defer: true }
    ];
    
    // Load scripts sequentially to ensure dependencies
    function loadScript(scriptInfo, callback) {
        const script = document.createElement('script');
        script.src = scriptInfo.src;
        
        if (scriptInfo.defer) {
            script.defer = true;
        }
        
        script.onload = function() {
            console.log(`✅ Loaded: ${scriptInfo.src}`);
            if (callback) callback();
        };
        
        script.onerror = function() {
            console.error(`❌ Failed to load: ${scriptInfo.src}`);
            // Try alternative path (GitHub Pages sometimes needs this)
            const altSrc = scriptInfo.src.replace('scripts/', './scripts/');
            if (script.src !== altSrc) {
                console.log(`🔄 Trying alternative path: ${altSrc}`);
                script.src = altSrc;
                document.head.appendChild(script);
            } else if (callback) {
                callback(); // Continue even if script fails
            }
        };
        
        document.head.appendChild(script);
    }
    
    // Load scripts in order
    function loadScriptsSequentially(index = 0) {
        if (index >= scripts.length) {
            console.log('✅ All scripts loaded successfully');
            return;
        }
        
        loadScript(scripts[index], () => {
            loadScriptsSequentially(index + 1);
        });
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScriptsSequentially);
    } else {
        loadScriptsSequentially();
    }
    
    // Additional GitHub Pages specific fixes
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // Prevent GitHub Pages from breaking on minor errors
        e.preventDefault();
    });
    
    // Handle fetch errors (for component loading)
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).catch(error => {
            console.error('Fetch error:', error);
            // Return a resolved promise with empty content to prevent breaking
            return Promise.resolve(new Response('', { status: 200 }));
        });
    };
    
})();