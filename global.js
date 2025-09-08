// global.js - Updated for GSAP Integration

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // --- GSAP Utility Functions Available Globally ---
    
    // Function to add new elements for animation after page load
    window.addGSAPAnimation = function(selector, animationType = 'fade-in') {
        if (typeof gsap !== 'undefined') {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                switch(animationType) {
                    case 'fade-in':
                        gsap.fromTo(el, 
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                        );
                        break;
                    case 'scale-in':
                        gsap.fromTo(el,
                            { opacity: 0, scale: 0.8 },
                            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
                        );
                        break;
                    case 'slide-in':
                        gsap.fromTo(el,
                            { opacity: 0, x: -50 },
                            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
                        );
                        break;
                }
            });
        }
    };
    
    // Function to create custom scroll triggered animations
    window.createScrollTrigger = function(trigger, target, animation = {}) {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: trigger,
                start: "top 80%",
                onEnter: () => gsap.to(target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    ...animation
                })
            });
        }
    };
    
});
