// ==================== PROJECT FILTERING ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Projects script loaded');
    
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projects-grid');
    
    console.log('📊 Filter buttons found:', filterButtons.length);
    console.log('📊 Project cards found:', projectCards.length);
    console.log('📊 Projects grid element:', projectsGrid);
    
    // Initialize show more projects functionality
    const showMoreBtn = document.getElementById('show-more-btn');
    const allNonFeaturedProjects = document.querySelectorAll('.project-card:not(.featured)');
    
    // Initially hide non-featured projects
    if (showMoreBtn) {
        allNonFeaturedProjects.forEach(project => {
            project.style.display = 'none';
        });
        
        showMoreBtn.addEventListener('click', function() {
            const hiddenProjects = Array.from(document.querySelectorAll('.project-card')).filter(project => {
                return project.style.display === 'none' || window.getComputedStyle(project).display === 'none';
            });
            
            if (hiddenProjects.length > 0) {
                // Show all hidden projects
                hiddenProjects.forEach(project => {
                    project.style.display = 'flex';
                });
                
                this.textContent = 'Show Less';
            } else {
                // Hide non-featured projects again
                allNonFeaturedProjects.forEach(project => {
                    project.style.display = 'none';
                });
                
                this.textContent = 'Show More Projects';
            }
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            projectCards.forEach(card => {
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
});