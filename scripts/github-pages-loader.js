// GitHub Pages Compatible Script Loader
(function() {
    'use strict';
    
    // Script loading with error handling for GitHub Pages
    const scripts = [
        { src: 'scripts/main.js', defer: false },
        { src: 'scripts/animations.js', defer: true }
    ];
    
    // Load scripts sequentially to ensure dependencies
    function loadScript(scriptInfo, callback) {
        // Add null check to prevent errors with undefined scriptInfo
        if (!scriptInfo || !scriptInfo.src) {
            console.warn('⚠️ Invalid scriptInfo provided, skipping');
            if (callback) callback();
            return;
        }
        
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
        // Validate index bounds
        if (index >= scripts.length || index < 0) {
            console.log('✅ All scripts loaded successfully');
            return;
        }
        
        const scriptInfo = scripts[index];
        if (!scriptInfo) {
            console.warn(`⚠️ No script info at index ${index}, skipping`);
            loadScriptsSequentially(index + 1);
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
    
    // Safe fetch wrapper instead of overriding global fetch
    window.safeFetch = async function(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            console.error('Fetch failed:', url, error);
            // Return null instead of fake success
            return null;
        }
    };
    
})();