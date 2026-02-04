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
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('✅ Service Worker registered:', reg.scope))
                .catch(err => console.error('❌ Service Worker registration failed:', err));
        });
    }
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    // Single, clean toggle handler
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isActive);
        navLinks.setAttribute('aria-hidden', isActive);
        
        // Trap focus in mobile menu
        if (!isActive) {
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });
    
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            hamburger.focus();
        }
    });
    
    // Handle window resize - close menu on desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Initialize ARIA attributes
    navLinks.setAttribute('aria-hidden', 'true');
    
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

function initProjectsFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    
    if (buttons.length === 0) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            const filter = btn.dataset.filter;
            cards.forEach(card => {
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
}

function initSocialProof() {
    // Use event delegation to handle dynamically loaded content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('see-more-btn')) {
            const btn = e.target;
            const card = btn.closest('.recommendation-card');
            const truncated = card.querySelector('.truncated-text');
            const full = card.querySelector('.full-text');
            
            if (truncated && full) {
                const isExpanded = truncated.style.display === 'none';
                
                if (isExpanded) {
                    // Collapse
                    truncated.style.display = 'block';
                    full.style.display = 'none';
                    btn.textContent = 'See more...';
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    // Expand
                    truncated.style.display = 'none';
                    full.style.display = 'block';
                    btn.textContent = 'Show less';
                    btn.setAttribute('aria-expanded', 'true');
                    
                    // Smooth scroll
                    setTimeout(() => {
                        card.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
            }
        }
    });
    
    // Keyboard accessibility using event delegation
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('see-more-btn') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.target.click();
        }
    });
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
    const showMoreBtn = document.getElementById('show-more-btn');
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    // Initially hide non-featured projects
    const allProjects = projectsGrid.querySelectorAll('.project-card:not(.featured)');
    allProjects.forEach(project => {
        project.style.display = 'none';
    });
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            const hiddenProjects = Array.from(projectsGrid.querySelectorAll('.project-card')).filter(card => 
                card.style.display === 'none' || 
                getComputedStyle(card).display === 'none'
            );
            
            if (hiddenProjects.length > 0) {
                // Show all hidden projects
                Array.from(hiddenProjects).forEach(project => {
                    project.style.display = 'flex';
                    // Trigger reflow to ensure proper display
                    project.offsetHeight;
                });
                
                this.textContent = 'Show Less';
            } else {
                // Hide non-featured projects again
                allProjects.forEach(project => {
                    project.style.display = 'none';
                });
                
                this.textContent = 'Show More Projects';
            }
        });
    }
}