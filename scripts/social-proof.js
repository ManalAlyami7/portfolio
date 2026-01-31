// ==================== SOCIAL PROOF EXPAND/COLLAPSE FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function() {
    // Handle "See more..." buttons in social proof section
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.recommendation-card');
            const truncatedText = card.querySelector('.truncated-text');
            const fullText = card.querySelector('.full-text');
            
            if (card && truncatedText) {
                // Check if we're expanding or collapsing
                const isExpanded = truncatedText.style.display === 'none';
                
                if (isExpanded) {
                    // Collapse - show truncated text
                    if (truncatedText) truncatedText.style.display = 'block';
                    if (fullText) fullText.style.display = 'none';
                    this.textContent = 'See more...';
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    // Expand - show full text
                    if (truncatedText) truncatedText.style.display = 'none';
                    if (fullText) fullText.style.display = 'block';
                    this.textContent = 'Show less';
                    this.setAttribute('aria-expanded', 'true');
                }
                
                // Smooth scroll to keep the expanded content in view
                if (!isExpanded) {
                    setTimeout(() => {
                        card.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Add keyboard accessibility
    seeMoreButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});