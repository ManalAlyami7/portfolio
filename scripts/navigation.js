// ==================== MOBILE MENU IMPLEMENTATION ====================
// Enhanced with responsive design improvements

// Debounced resize handler for performance
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

function initMobileMenu() {
    console.log('📱 Initializing enhanced mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    
    console.log('🔍 Hamburger element:', hamburger);
    console.log('🔍 Nav links element:', navLinks);
    
    if (!hamburger) {
        console.warn('❌ Hamburger button not found');
        return;
    }
    
    if (!navLinks) {
        console.warn('❌ Nav links not found');
        return;
    }
    
    console.log('✅ Both elements found, adding enhanced event listeners');
    
    // Enhanced mobile menu functionality
    let isMenuOpen = false;
    
    // Improved click handler with better state management
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🍔 Hamburger clicked!');
        isMenuOpen = !isMenuOpen;
        
        // Toggle classes
        navLinks.classList.toggle('active', isMenuOpen);
        hamburger.classList.toggle('active', isMenuOpen);
        
        // Update ARIA attributes
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        navLinks.setAttribute('aria-hidden', !isMenuOpen);
        
        // Enhanced accessibility
        if (isMenuOpen) {
            // Focus first link for keyboard navigation
            setTimeout(() => {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            hamburger.focus();
        }
        
        console.log('🔄 Menu active state:', isMenuOpen);
        console.log('🔍 Nav links classes:', navLinks.className);
        console.log('🔍 Computed display:', getComputedStyle(navLinks).display);
        console.log('🔍 Window width:', window.innerWidth);
        console.log('🔍 Is in mobile breakpoint:', window.innerWidth <= 768);
    });
    
    // Improved click handler with better state management
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🍔 Hamburger clicked!');
        isMenuOpen = !isMenuOpen;
        
        // Toggle classes
        navLinks.classList.toggle('active', isMenuOpen);
        hamburger.classList.toggle('active', isMenuOpen);
        
        // Update ARIA attributes
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        
        // Enhanced accessibility
        if (isMenuOpen) {
            navLinks.setAttribute('aria-hidden', 'false');
            // Focus first link for keyboard navigation
            setTimeout(() => {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            navLinks.setAttribute('aria-hidden', 'true');
            hamburger.focus();
        }
        
        console.log('🔄 Menu active state:', isMenuOpen);
        console.log('🔍 Nav links classes:', navLinks.className);
        console.log('🔍 Computed display:', getComputedStyle(navLinks).display);
        console.log('🔍 Window width:', window.innerWidth);
        console.log('🔍 Is in mobile breakpoint:', window.innerWidth <= 768);
    });
    
    // Enhanced close menu when clicking a link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    isMenuOpen = false;
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    navLinks.setAttribute('aria-hidden', 'true');
                    hamburger.focus();
                }
            });
        });
    }
    
    // Enhanced close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            hamburger.focus();
        }
        
        // Tab navigation within menu
        if (isMenuOpen && e.key === 'Tab' && navLinks.contains(document.activeElement)) {
            const focusableElements = navLinks.querySelectorAll('a');
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
    
    // Handle window resize with debouncing
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && isMenuOpen) {
            // Close menu when switching to desktop
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
        
        // Adjust font sizes based on screen width
        adjustTypography();
        
        // Handle orientation changes
        handleOrientation();
    }, 250));
    
    // Initial setup
    handleOrientation();
    adjustTypography();
    
    // Enhanced theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                if (newTheme === 'dark') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    themeIcon.title = 'Switch to light mode';
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    themeIcon.title = 'Switch to dark mode';
                }
            }
            
            localStorage.setItem('theme', newTheme);
            
            // Add visual feedback
            this.style.transform = 'rotate(30deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // Keyboard support for theme toggle
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }
    
    // Helper functions
    function adjustTypography() {
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
    
    function handleOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);
    }
    
    // Detect touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    // Handle device orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            handleOrientation();
            adjustTypography();
        }, 100);
    });
    
    // Enhanced close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            hamburger.focus();
        }
        
        // Tab navigation within menu
        if (isMenuOpen && e.key === 'Tab' && navLinks.contains(document.activeElement)) {
            const focusableElements = navLinks.querySelectorAll('a');
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
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            // Close menu when switching to desktop
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Initialize ARIA attributes
    navLinks.setAttribute('aria-hidden', 'true');
    
    // Close menu when clicking a link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });
}

// ==================== PORTFOLIO INITIALIZATION ====================
function initializePortfolio() {
    console.log('🚀 Initializing portfolio...');
    // Initialize mobile menu
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project cards, experience items, and cert cards
    const animateElements = document.querySelectorAll(
        '.project-card, .experience-item, .cert-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active navigation highlighting
    highlightActiveSection();
    window.addEventListener('scroll', highlightActiveSection);
}

// ==================== ACTIVE SECTION HIGHLIGHTING ====================
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

// Initialize portfolio after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded event fired');
    initializePortfolio();
});