/* ============================================================
   CONFIG
   ============================================================ */
const INITIAL_VISIBLE = 6; // cards shown before "Show More"

/* ============================================================
   SWAP .bg-light → .bg-alt (dark theme compatibility)
   ============================================================ */
document.querySelectorAll('.bg-light').forEach(el => {
    el.classList.remove('bg-light');
    el.classList.add('bg-alt');
});

/* ============================================================
   NAVIGATION — Hamburger toggle
   ============================================================ */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', e => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ============================================================
   PROJECTS — Filter + Show More/Less
   ============================================================ */
const grid         = document.getElementById('projects-grid');
const filterBtns   = document.querySelectorAll('.filter-btn');
const showMoreBtn  = document.getElementById('show-more-btn');
const showMoreCount = document.getElementById('show-more-count');

// Inject no-results placeholder
const noResults = document.createElement('p');
noResults.className = 'no-results';
noResults.textContent = 'No projects in this category yet.';
grid.appendChild(noResults);

let activeFilter  = 'all';
let isExpanded    = false;

function getAllCards() {
    return Array.from(grid.querySelectorAll('.project-card'));
}

/**
 * Returns cards that match the current filter.
 * Featured cards always match 'all'; non-featured only show if their
 * data-category includes the active filter token.
 */
function getMatchingCards() {
    return getAllCards().filter(card => {
        if (activeFilter === 'all') return true;
        const cats = (card.dataset.category || '').split(' ');
        return cats.includes(activeFilter);
    });
}

function applyState() {
    const allCards     = getAllCards();
    const matching     = getMatchingCards();
    const nonMatching  = allCards.filter(c => !matching.includes(c));

    // 1. Hide cards that don't match the filter
    allCards.forEach(card => card.classList.remove('hidden-by-filter'));
    nonMatching.forEach(card => card.classList.add('hidden-by-filter'));

    // 2. Apply show-more logic only when filter is "all"
    if (activeFilter === 'all') {
        matching.forEach((card, i) => {
            if (isExpanded || i < INITIAL_VISIBLE) {
                card.classList.remove('hidden-by-more');
            } else {
                card.classList.add('hidden-by-more');
            }
        });

        const hidden = matching.length - INITIAL_VISIBLE;

        if (hidden <= 0) {
            // All cards fit — hide the button
            showMoreBtn.classList.add('force-hidden');
            showMoreCount.textContent = '';
        } else {
            showMoreBtn.classList.remove('force-hidden');
            showMoreBtn.setAttribute('aria-expanded', isExpanded);

            const label = showMoreBtn.querySelector('.btn-show-more-label');
            if (isExpanded) {
                label.textContent = 'Show Less';
                showMoreCount.textContent = '';
            } else {
                label.textContent = 'Show More Projects';
                showMoreCount.textContent = `${hidden} more project${hidden === 1 ? '' : 's'}`;
            }
        }
    } else {
        // Filter active — show all matching, hide show-more
        matching.forEach(card => card.classList.remove('hidden-by-more'));
        showMoreBtn.classList.add('force-hidden');
        showMoreCount.textContent = '';
    }

    // 3. No-results message
    if (matching.length === 0) {
        noResults.classList.add('visible');
    } else {
        noResults.classList.remove('visible');
    }
}

// Filter button clicks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        isExpanded   = false; // reset expand state on filter change
        applyState();
    });
});

// Show More / Show Less
showMoreBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    applyState();

    // Scroll to first newly revealed card when showing more
    if (isExpanded) return;
    // When collapsing, scroll back up to the projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Initial render
applyState();

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealTargets = [];

document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal');
    revealTargets.push(el);
});

document.querySelectorAll(
    '.projects-grid, .edu-grid, .testimonial-grid, .certs-grid, .experience-timeline, .filter-bar, .show-more-wrap'
).forEach(el => {
    el.classList.add('reveal', 'reveal-stagger');
    revealTargets.push(el);
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ============================================================
   TESTIMONIALS — Read More / Read Less toggle
   ============================================================ */
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const body       = btn.closest('.testimonial-body');
        const shortText  = body.querySelector('.text-short');
        const fullText   = body.querySelector('.text-full');
        const isOpen     = btn.getAttribute('aria-expanded') === 'true';

        shortText.classList.toggle('hidden', !isOpen);
        fullText.classList.toggle('hidden', isOpen);
        btn.textContent = isOpen ? 'Read More' : 'Read Less';
        btn.setAttribute('aria-expanded', !isOpen);
    });
});