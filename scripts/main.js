// main.js - Single source of truth for critical functionality
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation
    initNavigation();
    
    // 2. Dark mode
    initDarkMode();
    
    // 3. Projects filter
    initProjectsFilter();
    
    // 4. Show more projects
    initShowMoreProjects();
    
    // 5. Social proof
    initSocialProof();
    
    // 6. Date update
    updateFooterDate();
    
    // 7. Service worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Register service worker only if on the production domain
            const isGitHubPages = window.location.hostname.includes('github.io');
            const swUrl = isGitHubPages ? '/portfolio/sw.js' : '/sw.js';
            
            navigator.serviceWorker.register(swUrl)
                .then(reg => {
                    console.log('✅ Service Worker registered:', reg.scope);
                    
                    // Listen for updates
                    reg.addEventListener('updatefound', () => {
                        const installingWorker = reg.installing;
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New update available
                                if (confirm('New version available! Reload to update?')) {
                                    // Send skip waiting message to service worker
                                    if (reg.waiting) {
                                        reg.waiting.postMessage({type: 'SKIP_WAITING'});
                                    }
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch(err => console.warn('⚠️ Service Worker registration failed (expected on local dev):', err));
        });
        
        // Listen for controller changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!hamburger || !navLinks) return;
    
    // Initialize ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navLinks.setAttribute('aria-hidden', 'true');
    navLinks.setAttribute('role', 'menu');
    
    // Single, clean toggle handler
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        if (!isActive) {
            // Open menu
            navLinks.classList.add('active');
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            navLinks.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden'; // Lock body scroll
            
            // Focus first link
            const firstLink = navLinks.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        } else {
            // Close menu
            closeMenu();
        }
    });
    
    function closeMenu() {
        // Store reference to currently focused element
        const focusedElement = document.activeElement;
        
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Unlock body scroll
        
        // If the focused element was inside the menu, move focus to hamburger
        if (navLinks.contains(focusedElement)) {
            hamburger.focus();
        }
    }
    
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });
    
    // Handle window resize - close menu on desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    
    
    // Smooth scrolling for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80; // Account for fixed header height
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });
    
    // Active navigation highlighting
    highlightActiveSection();
    window.addEventListener('scroll', highlightActiveSection);
    
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

function initDarkMode() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    
    if (!toggle || !icon) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    const initialTheme = (savedTheme === 'dark' || (savedTheme === 'auto' && systemPrefersDark)) ? 'dark' : 'light';
    applyTheme(initialTheme);
    
    // Add event listener
    toggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add visual feedback
        this.style.transform = 'rotate(30deg) scale(1.1)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        
        console.log('🌙 Theme toggled to:', newTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.title = 'Switch to light mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.title = 'Switch to dark mode';
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    console.log('✅ Dark mode initialized successfully');
}

// Global state tracking
const ProjectManager = {
    currentFilter: 'all',
    showMoreActive: false,
    allCards: [],
    
    init: function() {
        // Get all cards once
        this.allCards = Array.from(document.querySelectorAll('.project-card'));
        this.initializeCards();
        this.setupFilterButtons();
        this.setupShowMoreButton();
    },
    
    initializeCards: function() {
        // Add state classes to all cards
        this.allCards.forEach(card => {
            const isFeatured = card.classList.contains('featured');
            
            // Mark featured vs non-featured
            if (isFeatured) {
                card.dataset.featured = 'true';
            } else {
                card.dataset.featured = 'false';
            }
        });
    },
    
    setupFilterButtons: function() {
        const filterButtons = document.querySelectorAll('.filter-btn');
            
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active')); 
                btn.classList.add('active');
                    
                // Update filter
                this.currentFilter = btn.dataset.filter;
                    
                // Reset show more when filter changes
                this.showMoreActive = false;
                const showMoreBtn = document.getElementById('show-more-btn');
                if (showMoreBtn) {
                    showMoreBtn.textContent = 'Show More Projects';
                    showMoreBtn.dataset.expanded = 'false';
                }
                    
                // Apply filter
                this.applyFilter();
            });
        });
    },
    
    setupShowMoreButton: function() {
        const showMoreBtn = document.getElementById('show-more-btn');
        if (!showMoreBtn) return;
        
        showMoreBtn.addEventListener('click', () => {
            this.showMoreActive = !this.showMoreActive;
            
            if (this.showMoreActive) {
                showMoreBtn.textContent = 'Show Less';
                showMoreBtn.dataset.expanded = 'true';
            } else {
                showMoreBtn.textContent = 'Show More Projects';
                showMoreBtn.dataset.expanded = 'false';
                
                // Scroll to projects section
                document.getElementById('projects').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            
            // Reapply filter to update visibility based on new showMore state
            this.applyFilter();
        });
    },
    
    applyFilter: function() {
        // Apply both filter and show more state
        this.allCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const isFeatured = card.dataset.featured === 'true';
            
            // Check if card passes filter
            const passesFilter = this.currentFilter === 'all' || cardCategory === this.currentFilter;
            
            if (passesFilter) {
                // Card passes the filter
                card.classList.remove('filtered-out');
                
                // Determine if card should be visible based on showMore state
                // Featured cards are always visible if they pass the filter
                // Non-featured cards are only visible if showMoreActive is true
                if (isFeatured) {
                    // Featured cards are always visible if they pass the filter
                    card.classList.remove('initially-hidden');
                } else {
                    // Non-featured cards depend on showMoreActive state
                    if (this.showMoreActive) {
                        card.classList.remove('initially-hidden');
                    } else {
                        card.classList.add('initially-hidden');
                    }
                }
            } else {
                // Card doesn't pass filter, hide it
                card.classList.add('filtered-out');
            }
        });
    },
    
    // Helper to check if everything is loaded
    isReady: function() {
        return this.allCards.length > 0 && document.querySelector('.filter-btn') !== null;
    }
};

function initProjectsFilter() {
    // Wait for components to be ready
    const waitForComponents = setInterval(() => {
        if (document.querySelectorAll('.project-card').length > 0) {
            clearInterval(waitForComponents);
            
            try {
                ProjectManager.init();
                ProjectManager.applyFilter();
            } catch (error) {
                console.error('Project filter initialization failed:', error);
                // Show minimal fallback UI
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.innerHTML = `
                        <div class="fallback-projects">
                            <h2>Projects</h2>
                            <p>Project filtering is temporarily unavailable. <button onclick="location.reload()">Reload</button></p>
                        </div>
                    `;
                }
            }
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(waitForComponents);
        
        // Check if components loaded after timeout
        if (document.querySelectorAll('.project-card').length === 0) {
            console.warn('Project components not loaded after timeout, attempting initialization');
            
            try {
                ProjectManager.init();
                ProjectManager.applyFilter();
            } catch (error) {
                console.error('Project filter initialization failed:', error);
                // Show minimal fallback UI
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.innerHTML = `
                        <div class="fallback-projects">
                            <h2>Projects</h2>
                            <p>Project filtering is temporarily unavailable. <button onclick="location.reload()">Reload</button></p>
                        </div>
                    `;
                }
            }
        }
    }, 5000);
}

function initSocialProof() {
    // Wait for components to load
    window.addEventListener('componentsLoaded', function() {
        setupSocialProofButtons();
    });
    
    // Also try immediate setup in case already loaded
    if (document.querySelector('.see-more-btn')) {
        setupSocialProofButtons();
    }
}

function setupSocialProofButtons() {
    // Use event delegation but check closest()
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.see-more-btn');
        if (!btn) return;
        
        e.preventDefault();
        
        const card = btn.closest('.recommendation-card');
        if (!card) {
            console.warn('No recommendation card found');
            return;
        }
        
        const truncated = card.querySelector('.truncated-text');
        const full = card.querySelector('.full-text');
        
        if (!truncated || !full) {
            console.warn('Missing text elements');
            return;
        }
        
        // Use classes instead of inline styles
        const isExpanded = truncated.classList.contains('hidden');
        
        if (isExpanded) {
            // Collapse
            truncated.classList.remove('hidden');
            full.classList.add('hidden');
            btn.textContent = 'See more...';
            btn.setAttribute('aria-expanded', 'false');
        } else {
            // Expand
            truncated.classList.add('hidden');
            full.classList.remove('hidden');
            btn.textContent = 'Show less';
            btn.setAttribute('aria-expanded', 'true');
            
            // Smooth scroll with delay to allow for expansion
            setTimeout(() => {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    }, { once: false }); // Allow multiple clicks
    
    // Keyboard accessibility using event delegation
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('see-more-btn') || e.target.closest('.see-more-btn')) {
            const btn = e.target.classList.contains('see-more-btn') ? e.target : e.target.closest('.see-more-btn');
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        }
    });
    
    console.log('✅ Social proof buttons initialized');
}

function updateFooterDate() {
    const yearEl = document.getElementById('current-year');
    const dateEl = document.getElementById('update-date');
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function initShowMoreProjects() {
    // This functionality is now handled by ProjectManager
    // Kept for compatibility with existing code structure
    console.log('✅ Show more projects managed by ProjectManager');
}