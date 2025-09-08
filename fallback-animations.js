// fallback-animations.js - Fallback for pages without GSAP

document.addEventListener('DOMContentLoaded', function() {
    
    // Simple fallback animations using CSS transitions
    const animateElements = document.querySelectorAll('.gsap-fade-in, .gsap-scale-in, .gsap-slide-left, .gsap-slide-right');
    
    // Ensure all elements are visible
    animateElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Simple scroll-triggered visibility
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('[data-gsap]').forEach(el => {
        observer.observe(el);
    });
    
    console.log('Fallback animations initialized');
});
