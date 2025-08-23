// global.js - UPDATED with Staggered Animation Logic

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Re-triggering & Staggered Scroll Animation Logic ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // === NEW: Check for staggered children ===
                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.add('animate-on-scroll', 'slide-in-up', `stagger-child-${i + 1}`);
                    }
                }

            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});