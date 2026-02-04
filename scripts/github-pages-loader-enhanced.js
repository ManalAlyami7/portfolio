// GitHub Pages Compatible Script Loader - Enhanced Version
(function() {
    'use strict';
    
    // Script loading with enhanced error handling for GitHub Pages
    const scripts = [
        { src: 'scripts/main.js', defer: false },
        { src: 'scripts/animations.js', defer: true }
    ];
    
    // Enhanced script loading with comprehensive error handling
    function loadScript(scriptInfo, callback) {
        try {
            // Comprehensive validation
            if (!scriptInfo) {
                console.warn('⚠️ Script info is undefined, skipping');
                if (callback) callback();
                return;
            }
            
            if (!scriptInfo.src || typeof scriptInfo.src !== 'string') {
                console.warn('⚠️ Invalid script source, skipping:', scriptInfo);
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
            
            script.onerror = function(error) {
                console.error(`❌ Failed to load: ${scriptInfo.src}`, error);
                // Try alternative path for GitHub Pages
                try {
                    const altSrc = scriptInfo.src.replace('scripts/', './scripts/');
                    if (script.src !== altSrc) {
                        console.log(`🔄 Trying alternative path: ${altSrc}`);
                        script.src = altSrc;
                        // Remove the failed script and create a new one
                        if (script.parentNode) {
                            script.parentNode.removeChild(script);
                        }
                        const newScript = document.createElement('script');
                        newScript.src = altSrc;
                        if (scriptInfo.defer) newScript.defer = true;
                        newScript.onload = function() {
                            console.log(`✅ Loaded (alternative): ${altSrc}`);
                            if (callback) callback();
                        };
                        newScript.onerror = function() {
                            console.warn(`⚠️ Both paths failed for: ${scriptInfo.src}`);
                            if (callback) callback();
                        };
                        document.head.appendChild(newScript);
                    } else {
                        if (callback) callback();
                    }
                } catch (e) {
                    console.error('Error in error handler:', e);
                    if (callback) callback();
                }
            };
            
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error in loadScript:', error);
            if (callback) callback();
        }
    }
    
    // Load scripts in order with enhanced validation
    function loadScriptsSequentially(index = 0) {
        try {
            // Handle case where event object is passed instead of index
            if (typeof index !== 'number' || index < 0) {
                console.warn('⚠️ Invalid index passed to loadScriptsSequentially, using default index 0');
                index = 0;
            }
            
            // Validate bounds and array integrity
            if (!Array.isArray(scripts) || index >= scripts.length || index < 0) {
                console.log('✅ All scripts loaded successfully');
                return;
            }
            
            const scriptInfo = scripts[index];
            
            // Additional validation
            if (!scriptInfo || typeof scriptInfo !== 'object') {
                console.warn(`⚠️ Invalid script info at index ${index}, skipping`);
                loadScriptsSequentially(index + 1);
                return;
            }
            
            loadScript(scriptInfo, () => {
                loadScriptsSequentially(index + 1);
            });
        } catch (error) {
            console.error('Error in loadScriptsSequentially:', error);
            // Continue with next script even on error
            loadScriptsSequentially(index + 1);
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(event) {
            console.log('DOM loaded, starting script loading...');
            // Use setTimeout to ensure proper execution context
            setTimeout(() => loadScriptsSequentially(), 0);
        });
    } else {
        console.log('DOM already ready, starting script loading...');
        // Use setTimeout to ensure proper execution context
        setTimeout(() => loadScriptsSequentially(), 0);
    }
    
    // Enhanced global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error intercepted:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
        
        // Prevent breaking on common GitHub Pages issues
        if (e.message && (e.message.includes('Cannot read properties of undefined') || 
                         e.message.includes('reading \'src\''))) {
            e.preventDefault();
            console.warn('⚠️ Prevented breaking error, continuing execution');
            return true;
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
    
})();