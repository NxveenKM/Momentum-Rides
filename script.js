// script.js for index.html
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // On-Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
});

// --- Homepage Booking Widget Logic ---

// NOTE: This is a separate form handler from the one in the original file.
// You can remove the old alert-based one if you wish.
const homepageBookingForm = document.getElementById('booking-form');

if (homepageBookingForm) {
    homepageBookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting the old way

        // 1. Get the values from the form
        const location = document.getElementById('pickup-location').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const dropoffDate = document.getElementById('dropoff-date').value;

        // 2. Validate that dates are selected
        if (!pickupDate || !dropoffDate) {
            alert('Please select both a pick-up and drop-off date.');
            return;
        }

        // 3. Build the URL with query parameters
        const queryParams = new URLSearchParams({
            location: location,
            pickup: pickupDate,
            dropoff: dropoffDate
        });

        // 4. Redirect the user to the fleet page with the search data
        window.location.href = `fleet.html?${queryParams.toString()}`;
    });
}