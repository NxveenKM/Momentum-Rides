// gsap-animations.js - Modern GSAP Animations for Momentum Rides

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Set initial states for all GSAP elements
    gsap.set('.gsap-fade-in', { opacity: 0, y: 30 });
    gsap.set('.gsap-scale-in', { opacity: 0, scale: 0.8 });
    gsap.set('.gsap-slide-left', { opacity: 0, x: -50 });
    gsap.set('.gsap-slide-right', { opacity: 0, x: 50 });
    
    // === HERO SECTION ANIMATIONS ===
    const heroTimeline = gsap.timeline({ delay: 0.5 });
    
    // Animate hero title with typewriter effect
    heroTimeline
        .to('[data-gsap="hero-title"]', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        })
        .to('[data-gsap="hero-subtitle"]', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.3")
        .to('[data-gsap="booking-widget"]', {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.2");
    
    // === BACKGROUND BLOBS ANIMATION ===
    gsap.to('.blob1', {
        x: 20,
        y: -30,
        rotation: 15,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
    
    gsap.to('.blob2', {
        x: -25,
        y: 20,
        rotation: -10,
        duration: 10,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1
    });
    
    gsap.to('.blob3', {
        x: 15,
        y: 25,
        rotation: 8,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2
    });
    
    gsap.to('.blob4', {
        x: -18,
        y: -15,
        rotation: -12,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.5
    });
    
    gsap.to('.blob5', {
        x: 22,
        y: 18,
        rotation: 6,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5
    });
    
    gsap.to('.blob6', {
        x: -12,
        y: -22,
        rotation: -8,
        duration: 13,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3
    });
    
    gsap.to('.blob7', {
        x: 16,
        y: -20,
        rotation: 10,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5
    });
    
    // === SCROLL TRIGGERED ANIMATIONS ===
    
    // Steps Section Animation
    ScrollTrigger.create({
        trigger: '[data-gsap="steps-section"]',
        start: "top 80%",
        onEnter: () => {
            // Animate section title
            gsap.to('[data-gsap="steps-title"]', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
            
            // Stagger animate steps
            gsap.to('[data-gsap="step"]', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.3
            });
            
            // Animate step icons with bounce
            gsap.to('.step-icon', {
                scale: 1.1,
                duration: 0.3,
                stagger: 0.2,
                ease: "back.out(1.7)",
                delay: 0.8,
                yoyo: true,
                repeat: 1
            });
        }
    });
    
    // Blog Section Animation
    ScrollTrigger.create({
        trigger: '[data-gsap="blog-section"]',
        start: "top 80%",
        onEnter: () => {
            // Animate blog title
            gsap.to('[data-gsap="blog-title"]', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
            
            // Stagger animate blog cards with scale effect
            gsap.to('[data-gsap="blog-card"]', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "back.out(1.2)",
                delay: 0.3
            });
        }
    });
    
    // === NAVBAR SCROLL ANIMATION ===
    let lastScrollY = 0;
    const navbar = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down
                gsap.to(navbar, {
                    y: -100,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                // Scrolling up
                gsap.to(navbar, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        } else {
            navbar.classList.remove('scrolled');
            gsap.to(navbar, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
        lastScrollY = currentScrollY;
    });
    
    // === INTERACTIVE HOVER ANIMATIONS ===
    
    // Card hover effects
    document.querySelectorAll('.car-card, .blog-card, .service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Button hover effects
    document.querySelectorAll('.btn-search, .nav-cta, .btn-primary-full, .btn-service').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                y: -3,
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                y: 0,
                scale: 1,
                boxShadow: "none",
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
    
    // === LOADING ANIMATION ===
    
    // Page load animation
    const loadTimeline = gsap.timeline();
    
    loadTimeline
        .from('body', {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        .from('.header', {
            y: -100,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.3");
    
    // === FOOTER ANIMATION ===
    
    ScrollTrigger.create({
        trigger: '.footer',
        start: "top 90%",
        onEnter: () => {
            gsap.from('.footer-content > div', {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });
    
    // === MOBILE MENU ANIMATION ===
    
    const mobileMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                // Close animation
                gsap.to('.nav-item', {
                    opacity: 0,
                    x: -20,
                    duration: 0.2,
                    stagger: 0.05,
                    ease: "power2.in"
                });
            } else {
                // Open animation
                gsap.fromTo('.nav-item', 
                    { opacity: 0, x: -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        stagger: 0.08,
                        ease: "power2.out",
                        delay: 0.1
                    }
                );
            }
        });
    }
    
    // === PERFORMANCE OPTIMIZATION ===
    
    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
    
    // Disable animations on reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.clear();
        gsap.set("*", { clearProps: "all" });
    }
    
});

// === UTILITY FUNCTIONS ===

// Function to animate elements when they come into view
function animateOnScroll(selector, animation = {}) {
    ScrollTrigger.create({
        trigger: selector,
        start: "top 85%",
        onEnter: () => gsap.to(selector, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            ...animation
        })
    });
}

// Function to create stagger animations
function staggerAnimation(selector, delay = 0.1) {
    ScrollTrigger.create({
        trigger: selector,
        start: "top 85%",
        onEnter: () => gsap.to(selector, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: delay,
            ease: "power2.out"
        })
    });
}
