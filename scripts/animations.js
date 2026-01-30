// ==================== ANIMATIONS ====================

// Add loader functionality
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-container">
            <div class="loader-spinner"></div>
        </div>
    `;
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

// Initialize all animations after page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any additional animations here
});