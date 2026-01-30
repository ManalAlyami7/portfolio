// ==================== MICRO-INTERACTIONS & ANIMATIONS ====================

// Initialize all micro-interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initSectionReveal();
    initCounterAnimations();
    initProjectCardInteractions();
    initButtonPulseEffects();
});

// ==================== SCROLL PROGRESS INDICATOR ====================
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ==================== SECTION REVEAL ANIMATIONS ====================
function initSectionReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections and key elements
    const revealElements = document.querySelectorAll(
        'section, .project-card, .experience-item, .achievement-card, .cert-card'
    );
    
    revealElements.forEach(el => {
        el.classList.add('section-enter');
        observer.observe(el);
    });
}

// ==================== NUMBER COUNTER ANIMATIONS ====================
function initCounterAnimations() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const endValue = parseInt(element.getAttribute('data-count') || element.textContent.replace(/\D/g, ''));
                
                if (endValue && !element.classList.contains('counted')) {
                    animateCounter(element, endValue);
                    element.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Find elements with numeric values
    const counterElements = document.querySelectorAll('.tag--metric');
    counterElements.forEach(el => {
        const text = el.textContent;
        const numberMatch = text.match(/[\d,]+/);
        if (numberMatch) {
            el.setAttribute('data-count', numberMatch[0].replace(/,/g, ''));
            el.classList.add('counter');
            counterObserver.observe(el);
        }
    });
}

function animateCounter(element, endValue) {
    let startValue = 0;
    const duration = 2000; // 2 seconds
    const increment = endValue / (duration / 16); // 60fps approximation
    
    const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
            startValue = endValue;
            clearInterval(timer);
        }
        
        // Format the number with commas
        const formattedValue = Math.floor(startValue).toLocaleString();
        const originalText = element.textContent;
        const newText = originalText.replace(/[\d,]+/, formattedValue);
        element.textContent = newText;
    }, 16);
}

// ==================== PROJECT CARD INTERACTIONS ====================
function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

// ==================== BUTTON PULSE EFFECTS ====================
function initButtonPulseEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add hover pulse effect
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
        });
        
        button.addEventListener('animationend', function() {
            this.style.animation = '';
        });
        
        // Add click feedback
        button.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = element.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    // Add CSS for ripple effect
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== SMOOTH SCROLLING ENHANCEMENTS ====================
// Enhanced smooth scrolling with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Debounce scroll events for better performance
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

// Throttle scroll events
const throttledScroll = debounce(function() {
    // Scroll-dependent animations can be added here
}, 16);

window.addEventListener('scroll', throttledScroll);