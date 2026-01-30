// ==================== PROJECT FILTERING AND TIMELINE ====================
document.addEventListener('DOMContentLoaded', function() {
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projects-grid');
    
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
                    
                    // Reapply animation class if in timeline view
                    if (projectsGrid && projectsGrid.classList.contains('timeline-view')) {
                        project.classList.remove('loaded');
                        void project.offsetWidth; // Trigger reflow
                        project.classList.add('loaded');
                    }
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
                    
                    // Reapply animation class if in timeline view
                    if (projectsGrid && projectsGrid.classList.contains('timeline-view')) {
                        card.classList.remove('loaded');
                        void card.offsetWidth; // Trigger reflow
                        card.classList.add('loaded');
                    }
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Timeline toggle
    const timelineToggle = document.getElementById('timeline-view');
    
    if (timelineToggle && projectsGrid) {
        timelineToggle.addEventListener('change', function() {
            if (this.checked) {
                projectsGrid.classList.add('timeline-view');
                // Sort projects by date
                setTimeout(() => {
                    sortProjectsByDate();
                    // Trigger reflow to restart animations
                    const cards = projectsGrid.querySelectorAll('.project-card:not(.hidden)');
                    cards.forEach(card => {
                        card.classList.remove('loaded');
                        void card.offsetWidth; // Trigger reflow
                        card.classList.add('loaded');
                    });
                }, 10);
            } else {
                projectsGrid.classList.remove('timeline-view');
                // Remove animations when leaving timeline view
                const cards = projectsGrid.querySelectorAll('.project-card');
                cards.forEach(card => {
                    card.classList.remove('loaded');
                });
            }
        });
    }
    
    function sortProjectsByDate() {
        const projectsArray = Array.from(projectsGrid.querySelectorAll('.project-card:not(.hidden)'));
        projectsArray.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateA - dateB;
        });
        
        // Re-append sorted projects
        projectsArray.forEach(project => {
            projectsGrid.appendChild(project);
        });
    }
    
    // Initialize timeline view if toggle is checked on page load
    if (timelineToggle && timelineToggle.checked && projectsGrid) {
        setTimeout(() => {
            projectsGrid.classList.add('timeline-view');
            sortProjectsByDate();
            // Apply animations to visible cards
            const visibleCards = projectsGrid.querySelectorAll('.project-card:not(.hidden)');
            visibleCards.forEach(card => {
                card.classList.remove('loaded');
                void card.offsetWidth; // Trigger reflow
                card.classList.add('loaded');
            });
        }, 10);
    }
});