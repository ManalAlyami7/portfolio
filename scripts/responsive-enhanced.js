// ==================== ENHANCED RESPONSIVE JAVASCRIPT ====================
// Senior Front-End Engineer Responsive Enhancement
// These are non-breaking enhancements to improve responsive behavior

// ==================== DEBOUNCED RESIZE HANDLER ====================
// Prevents excessive function calls during window resizing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== ENHANCED MOBILE MENU FUNCTIONALITY ====================
class ResponsiveNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.themeToggle = document.getElementById('theme-toggle');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.hamburger && this.navLinks) {
            this.setupEventListeners();
            this.setupKeyboardNavigation();
            this.handleOrientationChange();
        }
        
        // Enhanced theme toggle with better error handling
        if (this.themeToggle) {
            this.setupThemeToggle();
        }
        
        // Handle window resize with debouncing
        window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
        
        // Initial setup
        this.handleResize();
    }
    
    setupEventListeners() {
        // Enhanced click handler with better state management
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Close menu when clicking links
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.hamburger.contains(e.target) && 
                !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard support
        document.addEventListener('keydown', (e) => {
            // Escape key to close menu
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
                this.hamburger.focus();
                return;
            }
            
            // Tab navigation within menu
            if (this.isMenuOpen && e.key === 'Tab' && this.navLinks.contains(document.activeElement)) {
                const focusableElements = this.navLinks.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    setupThemeToggle() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard support for theme toggle
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Toggle classes
        this.navLinks.classList.toggle('active', this.isMenuOpen);
        this.hamburger.classList.toggle('active', this.isMenuOpen);
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', this.isMenuOpen);
        this.navLinks.setAttribute('aria-hidden', !this.isMenuOpen);
        
        // Focus management
        if (this.isMenuOpen) {
            // Focus first link for keyboard navigation
            setTimeout(() => {
                const firstLink = this.navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            this.hamburger.focus();
        }
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navLinks.setAttribute('aria-hidden', 'true');
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update theme icon
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (newTheme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                themeIcon.setAttribute('aria-label', 'Switch to light mode');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                themeIcon.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Visual feedback
        this.themeToggle.style.transform = 'rotate(30deg) scale(1.1)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    handleResize() {
        // Close menu when switching to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
        
        // Adjust font sizes based on screen width
        this.adjustTypography();
        
        // Handle orientation changes
        this.handleOrientation();
    }
    
    handleOrientationChange() {
        // Handle device orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }
    
    handleOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);
    }
    
    adjustTypography() {
        // Dynamic font sizing based on viewport
        const baseFontSize = 16;
        const screenWidth = window.innerWidth;
        
        let fontSize;
        if (screenWidth <= 360) {
            fontSize = baseFontSize * 0.875; // 14px
        } else if (screenWidth <= 480) {
            fontSize = baseFontSize * 0.9375; // 15px
        } else if (screenWidth <= 768) {
            fontSize = baseFontSize; // 16px
        } else {
            fontSize = baseFontSize * 1.0625; // 17px
        }
        
        document.documentElement.style.fontSize = `${fontSize}px`;
    }
}

// ==================== ENHANCED TOUCH HANDLING ====================
class TouchEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        // Detect touch devices
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (this.isTouchDevice) {
            this.setupTouchOptimizations();
        }
        
        // Setup hover intent for better UX
        this.setupHoverIntent();
    }
    
    setupTouchOptimizations() {
        // Add touch-friendly classes
        document.body.classList.add('touch-device');
        
        // Enhanced touch targets
        const buttons = document.querySelectorAll('.btn, .filter-btn, .project-card');
        buttons.forEach(button => {
            // Ensure minimum touch target size
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                button.classList.add('touch-enhanced');
            }
        });
    }
    
    setupHoverIntent() {
        // Delay hover effects to prevent accidental triggers
        const hoverElements = document.querySelectorAll('.project-card, .btn');
        
        hoverElements.forEach(element => {
            let hoverTimeout;
            
            element.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    element.classList.add('intent-hover');
                }, 300);
            });
            
            element.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                element.classList.remove('intent-hover');
            });
        });
    }
}

// ==================== PERFORMANCE ENHANCEMENTS ====================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Optimize animations
        this.setupAnimationOptimization();
        
        // Handle reduced motion preference
        this.handleReducedMotion();
    }
    
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    setupAnimationOptimization() {
        // Disable animations on low-end devices
        const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                             /Android|iPhone|iPod|iPad/.test(navigator.userAgent);
        
        if (isLowEndDevice) {
            document.body.classList.add('low-performance');
        }
    }
    
    handleReducedMotion() {
        // Respect user's motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all responsive enhancements
    new ResponsiveNavigation();
    new TouchEnhancements();
    new PerformanceOptimizer();
    
    // Log initialization
    console.log('📱 Enhanced responsive functionality initialized');
});

// ==================== OPTIONAL: SERVICE WORKER REGISTRATION ====================
// Uncomment if you want to add offline support
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered: ', registration.scope);
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed: ', error);
            });
    });
}
*/