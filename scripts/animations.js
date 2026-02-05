// animations.js - Progressive enhancements and micro-interactions
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

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
    
    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // Enhanced micro-interactions
    initMicroInteractions();
});

// Class to manage card tilt interactions
class CardTiltManager {
    constructor(card) {
        this.card = card;
        this.rafId = null;
        this.lastX = 0;
        this.lastY = 0;
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        
        this.card.addEventListener('mousemove', this.handleMouseMove);
        this.card.addEventListener('mouseleave', this.handleMouseLeave);
    }
    
    handleMouseMove(e) {
        if (this.rafId) return; // Skip if already scheduled
        
        this.rafId = requestAnimationFrame(() => {
            const rect = this.card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only update if movement is significant
            if (Math.abs(x - this.lastX) > 5 || Math.abs(y - this.lastY) > 5) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / 10);
                const rotateY = ((centerX - x) / 10);
                
                // Use CSS custom properties instead of direct transform
                this.card.style.setProperty('--rotate-x', `${rotateX}deg`);
                this.card.style.setProperty('--rotate-y', `${rotateY}deg`);
                
                this.lastX = x;
                this.lastY = y;
            }
            
            this.rafId = null;
        });
    }
    
    handleMouseLeave() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.card.style.removeProperty('--rotate-x');
        this.card.style.removeProperty('--rotate-y');
    }
    
    destroy() {
        this.card.removeEventListener('mousemove', this.handleMouseMove);
        this.card.removeEventListener('mouseleave', this.handleMouseLeave);
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }
}

// Store instances for cleanup
let tiltManagers = [];

function initMicroInteractions() {
    // Clean up any existing managers
    if (tiltManagers.length > 0) {
        tiltManagers.forEach(manager => manager.destroy());
        tiltManagers = [];
    }
    
    // Add hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Create tilt managers for each card
    tiltManagers = Array.from(projectCards).map(card => new CardTiltManager(card));
    
    // Add button pulse effect
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
    
    // Add subtle pulse animation for primary buttons
    const primaryButtons = document.querySelectorAll('.btn-primary');
    
    primaryButtons.forEach(button => {
        button.style.animation = 'subtle-pulse 2s infinite';
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (tiltManagers.length > 0) {
        tiltManagers.forEach(manager => manager.destroy());
        tiltManagers = [];
    }
});

// Add keyframe animations if they don't exist
if (!document.getElementById('dynamic-animations')) {
    const style = document.createElement('style');
    style.id = 'dynamic-animations';
    style.textContent = `
        @keyframes subtle-pulse {
            0% { box-shadow: 0 0 0 0 rgba(46, 89, 57, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(46, 89, 57, 0); }
            100% { box-shadow: 0 0 0 0 rgba(46, 89, 57, 0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 9999;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}