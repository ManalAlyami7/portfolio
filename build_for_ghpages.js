// Build script to combine modular HTML files into a single file for GitHub Pages
const fs = require('fs');
const path = require('path');

// Read the main index.html file
const indexContent = fs.readFileSync('./index.html', 'utf8');

// Define the placeholders and their corresponding module files
const placeholders = {
    'nav-placeholder': './modules/nav.html',
    'hero-placeholder': './modules/hero.html',
    'about-placeholder': './modules/about.html',
    'experience-placeholder': './modules/experience.html',
    'projects-placeholder': './modules/projects.html',
    'contact-placeholder': './modules/contact.html',
    'footer-placeholder': './modules/footer.html'
};

let finalContent = indexContent;

// Replace each placeholder with the content of its respective module
for (const [placeholder, modulePath] of Object.entries(placeholders)) {
    if (fs.existsSync(modulePath)) {
        const moduleContent = fs.readFileSync(modulePath, 'utf8');
        // Replace the div with id="placeholder-name" with the module content
        const placeholderRegex = new RegExp(`<div id="${placeholder}"><\\/div>`, 'gi');
        finalContent = finalContent.replace(placeholderRegex, moduleContent.trim());
    } else {
        console.warn(`Module file ${modulePath} not found, keeping placeholder`);
    }
}

// Change the script reference to remove the modular loading functionality
// We'll create a simplified JS file for the combined version
const simplifiedJS = `// Simplified JS for GitHub Pages build
document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
});

// ==================== PORTFOLIO INITIALIZATION ====================
function initializePortfolio() {
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
        if (link.getAttribute('href') === \`#\${currentSection}\`) {
            link.classList.add('active');
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Add loading animation
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = \`
        <div class="loader-container">
            <div class="loader-spinner"></div>
        </div>
    \`;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.remove();
    }
}

// Optional: Show loader on page load
window.addEventListener('load', () => {
    hideLoader();
});

// Also hide loader after a delay in case DOMContentLoaded fires slowly
setTimeout(() => {
    hideLoader();
}, 3000);
`;

// Write the simplified JS to a new file
fs.writeFileSync('./js/main-ghpages.js', simplifiedJS);

// Update the script reference in the final content
finalContent = finalContent.replace(/<script src="js\/main\.js"><\/script>/, '<script src="js/main-ghpages.js"></script>');

// Write the final combined HTML to a new file
fs.writeFileSync('./index-ghpages.html', finalContent);

console.log('GitHub Pages build completed successfully!');
console.log('Generated files:');
console.log('- index-ghpages.html (combined HTML file)');
console.log('- js/main-ghpages.js (simplified JavaScript)');
console.log('');
console.log('To use with GitHub Pages:');
console.log('1. Rename index-ghpages.html to index.html');
console.log('2. Push to your GitHub repository');
console.log('3. Configure GitHub Pages to use the root directory');