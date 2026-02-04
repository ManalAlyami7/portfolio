// Component Loader - Load HTML components
(function() {
    'use strict';
    
    const components = [
        { id: 'header-component', file: 'components/header.html' },
        { id: 'hero-component', file: 'components/hero.html' },
        { id: 'about-component', file: 'components/about.html' },
        { id: 'projects-component', file: 'components/projects.html' },
        { id: 'experience-component', file: 'components/experience.html' },
        { id: 'social-proof-component', file: 'components/social-proof.html' },
        { id: 'contact-component', file: 'components/contact.html' },
        { id: 'footer-component', file: 'components/footer.html' }
    ];
    
    let loadedComponents = 0;
    const totalComponents = components.length;
    
    async function loadComponent(component) {
        const element = document.getElementById(component.id);
        if (!element) {
            console.warn(`Element ${component.id} not found`);
            return;
        }
        
        try {
            const response = await fetch(component.file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            
            // Safer approach: Use DOMParser to parse HTML and sanitize
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Clear the target element
            element.innerHTML = '';
            
            // Extract body content and append child nodes safely
            const bodyContent = doc.body ? doc.body.childNodes : doc.childNodes;
            
            // Append each child node individually
            for (let i = 0; i < bodyContent.length; i++) {
                const node = bodyContent[i].cloneNode(true);
                element.appendChild(node);
            }
            
            loadedComponents++;
            updateProgress();
            
            console.log(`✅ Loaded: ${component.file}`);
        } catch (error) {
            console.error(`Failed to load ${component.file}:`, error);
            
            // Show user-friendly error
            element.innerHTML = `
                <div class="component-error">
                    <div class="error-icon">⚠️</div>
                    <h3>Unable to load component</h3>
                    <p>Please refresh the page to try again.</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Refresh Page
                    </button>
                </div>
            `;
            
            loadedComponents++; // Count as loaded to continue
            updateProgress();
        }
    }
    
    function updateProgress() {
        const progress = (loadedComponents / totalComponents) * 100;
        
        // Update progress bar
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }
        
        if (loadingText) {
            loadingText.textContent = `Loading... ${Math.round(progress)}%`;
        }
        
        if (loadedComponents === totalComponents) {
            onAllComponentsLoaded();
        }
    }
    
    function onAllComponentsLoaded() {
        console.log('✅ All components loaded');
        
        // Hide loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 300);
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
        
        // Initialize functionality that depends on components
        if (typeof initNavigation === 'function') initNavigation();
        if (typeof initDarkMode === 'function') initDarkMode();
        if (typeof initProjectsFilter === 'function') initProjectsFilter();
        if (typeof initShowMoreProjects === 'function') initShowMoreProjects();
        if (typeof initSocialProof === 'function') initSocialProof();
        if (typeof updateFooterDate === 'function') updateFooterDate();
    }
    
    // Load all components
    async function loadAllComponents() {
        console.log('🔄 Loading components...');
        await Promise.all(components.map(loadComponent));
    }
    
    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
})();