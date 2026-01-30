// ==================== AUTO UPDATE DATE ====================
function updateLastModifiedDate() {
    const updateDateElement = document.getElementById('update-date');
    if (updateDateElement) {
        // Get current date
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('en-US', options);
        updateDateElement.textContent = formattedDate;
    }
}

// Update date when page loads
document.addEventListener('DOMContentLoaded', updateLastModifiedDate);

// Also update date on page load event
window.addEventListener('load', updateLastModifiedDate);

// Add floating animation to banner logo
function initBannerAnimation() {
    const bannerLogo = document.querySelector('.banner-logo');
    if (bannerLogo) {
        bannerLogo.style.animation = 'floatAndGlow 4s ease-in-out infinite';
    }
}

// Initialize banner animation
window.addEventListener('load', initBannerAnimation);