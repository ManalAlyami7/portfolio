// ==================== PORTFOLIO MASTER INITIALIZER ====================
// Consolidated script to ensure all functionality loads properly

(function() {
    'use strict';
    
    console.log('🚀 Portfolio Master Initializer Starting...');
    
    // Check if all required elements exist
    function checkElements() {
        const elements = {
            themeToggle: document.getElementById('theme-toggle'),
            themeIcon: document.getElementById('theme-icon'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            projectCards: document.querySelectorAll('.project-card'),
            projectsGrid: document.getElementById('projects-grid'),
            seeMoreButtons: document.querySelectorAll('.see-more-btn'),
            showMoreBtn: document.getElementById('show-more-btn')
        };
        
        console.log('🔍 Element Check Results:');
        Object.entries(elements).forEach(([name, element]) => {
            if (element && element.length !== undefined) {
                console.log(`  ${name}: ${element.length} elements found`);
            } else if (element) {
                console.log(`  ${name}: Element found`);
            } else {
                console.warn(`  ❌ ${name}: NOT FOUND`);
            }
        });
        
        return elements;
    }
    
    // Initialize all functionality
    function initializeAll() {
        console.log('⚙️ Initializing all portfolio functionality...');
        
        const elements = checkElements();
        
        // Initialize projects functionality if elements exist
        if (elements.filterButtons.length > 0 && elements.projectCards.length > 0) {
            initializeProjects(elements.filterButtons, elements.projectCards, elements.projectsGrid);
        }
        
        // Initialize social proof if elements exist
        if (elements.seeMoreButtons.length > 0) {
            initializeSocialProof(elements.seeMoreButtons);
        }
        
        // Initialize show more projects if element exists
        if (elements.showMoreBtn) {
            initializeShowMore(elements.showMoreBtn);
        }
        
        console.log('✅ All portfolio functionality initialized');
    }
    
    // Projects Initialization
    function initializeProjects(filterButtons, projectCards, projectsGrid) {
        console.log('🚀 Initializing Projects...');
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                console.log('🎯 Filtering projects by:', filter);
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                        card.style.display = 'flex';
                        

                    } else {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        console.log('✅ Projects initialized');
    }
    
    // Social Proof Initialization
    function initializeSocialProof(seeMoreButtons) {
        console.log('👥 Initializing Social Proof...');
        
        seeMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.recommendation-card');
                const truncatedText = card.querySelector('.truncated-text');
                const fullText = card.querySelector('.full-text');
                
                if (card && truncatedText && fullText) {
                    const isExpanded = truncatedText.style.display === 'none';
                    
                    if (isExpanded) {
                        // Collapse
                        truncatedText.style.display = 'block';
                        fullText.style.display = 'none';
                        this.textContent = 'See more...';
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        // Expand
                        truncatedText.style.display = 'none';
                        fullText.style.display = 'block';
                        this.textContent = 'Show less';
                        this.setAttribute('aria-expanded', 'true');
                        
                        // Smooth scroll
                        setTimeout(() => {
                            card.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }, 300);
                    }
                    
                    console.log('👥 Recommendation toggled:', isExpanded ? 'collapsed' : 'expanded');
                }
            });
            
            // Keyboard accessibility
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        console.log('✅ Social Proof initialized');
    }
    
    // Show More Projects Initialization
    function initializeShowMore(showMoreBtn) {
        console.log('➕ Initializing Show More Projects...');
        
        const allNonFeaturedProjects = document.querySelectorAll('.project-card:not(.featured)');
        
        // Initially hide non-featured projects
        allNonFeaturedProjects.forEach(project => {
            project.style.display = 'none';
        });
        
        showMoreBtn.addEventListener('click', function() {
            const hiddenProjects = Array.from(document.querySelectorAll('.project-card')).filter(project => {
                return project.style.display === 'none' || window.getComputedStyle(project).display === 'none';
            });
            
            if (hiddenProjects.length > 0) {
                // Show all hidden projects
                hiddenProjects.forEach(project => {
                    project.style.display = 'flex';
                });
                this.textContent = 'Show Less';
                console.log('➕ Showing more projects:', hiddenProjects.length);
            } else {
                // Hide non-featured projects
                allNonFeaturedProjects.forEach(project => {
                    project.style.display = 'none';
                });
                this.textContent = 'Show More Projects';
                console.log('➖ Hiding extra projects');
            }
        });
        
        console.log('✅ Show More Projects initialized');
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        // DOM already loaded
        initializeAll();
    }
    
    // Also listen for the window load event as backup
    window.addEventListener('load', function() {
        console.log('🌍 Window fully loaded, finalizing initialization...');
        setTimeout(initializeAll, 100);
    });
    
})();