// ==================== MOBILE MENU IMPLEMENTATION ====================
function initMobileMenu() {
    console.log('📱 Initializing mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
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
    
    console.log('✅ Both elements found, adding event listeners');
    
    hamburger.addEventListener('click', () => {
        console.log('🍔 Hamburger clicked!');
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive);
        console.log('🔄 Menu active state:', isActive);
    });
    
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