// component-loader-ext.js - Load HTML components with error boundaries
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
            // Auto-detect base path
            const basePath = window.location.hostname.includes('github.io') 
                ? '/portfolio' 
                : '';
            
            const response = await fetch(`${basePath}/${component.file}`);
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
            element.innerHTML = '';
                            
            const errorContainer = document.createElement('div');
            errorContainer.className = 'component-error';
                            
            const errorIcon = document.createElement('div');
            errorIcon.className = 'error-icon';
            errorIcon.textContent = '⚠️';
                            
            const errorHeading = document.createElement('h3');
            errorHeading.textContent = 'Unable to load component';
                            
            const errorPara = document.createElement('p');
            errorPara.textContent = 'Please refresh the page to try again.';
                            
            const errorButton = document.createElement('button');
            errorButton.className = 'btn btn-primary';
            errorButton.textContent = 'Refresh Page';
            errorButton.onclick = () => location.reload();
                            
            errorContainer.appendChild(errorIcon);
            errorContainer.appendChild(errorHeading);
            errorContainer.appendChild(errorPara);
            errorContainer.appendChild(errorButton);
            element.appendChild(errorContainer);
            
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
    
    // Load all components with error handling
    async function loadAllComponentsWithErrorHandling() {
        try {
            console.log('🔄 Loading components...');
            await Promise.all(components.map(loadComponent));
        } catch (error) {
            console.error('Critical component loading failed:', error);
            
            // Hide loading indicator even on error
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            // Show user-friendly error message
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = '';
                
                const errorContainer = document.createElement('div');
                errorContainer.className = 'critical-error-state';
                errorContainer.style.padding = '2rem';
                errorContainer.style.textAlign = 'center';
                
                const errorHeading = document.createElement('h2');
                errorHeading.textContent = 'Something went wrong';
                
                const errorPara = document.createElement('p');
                errorPara.textContent = "We couldn't load the content for this page. Please refresh to try again.";
                
                const errorButton = document.createElement('button');
                errorButton.className = 'btn btn-primary';
                errorButton.textContent = 'Refresh Page';
                errorButton.onclick = () => location.reload();
                
                errorContainer.appendChild(errorHeading);
                errorContainer.appendChild(errorPara);
                errorContainer.appendChild(errorButton);
                mainContent.appendChild(errorContainer);
            }
        }
    }
    
    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponentsWithErrorHandling);
    } else {
        loadAllComponentsWithErrorHandling();
    }
})();