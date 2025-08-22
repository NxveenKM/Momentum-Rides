// global.js - Handles animations and mobile navigation for all pages

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Re-triggering Scroll Animation Logic ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is intersecting (in view)
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } 
            // If the element is NOT intersecting (out of view)
            else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
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