// script.js for index.html - UPDATED with Date Validation

document.addEventListener('DOMContentLoaded', function() {
    // --- Disable Past Dates in Booking Widget ---
    function setMinDateForPickers() {
        const today = new Date().toISOString().split('T')[0];
        const pickupDateInput = document.getElementById('pickup-date');
        const dropoffDateInput = document.getElementById('dropoff-date');

        if (pickupDateInput) {
            pickupDateInput.setAttribute('min', today);
        }
        if (dropoffDateInput) {
            dropoffDateInput.setAttribute('min', today);
        }
    }
    setMinDateForPickers();

    // --- NEW: Link Start and End Dates ---
    function linkDatePickers() {
        const pickupDateInput = document.getElementById('pickup-date');
        const dropoffDateInput = document.getElementById('dropoff-date');

        if (pickupDateInput && dropoffDateInput) {
            pickupDateInput.addEventListener('change', () => {
                // When the start date changes, set the minimum for the end date
                if (pickupDateInput.value) {
                    dropoffDateInput.min = pickupDateInput.value;
                    // If the current end date is now invalid, clear it
                    if (dropoffDateInput.value < pickupDateInput.value) {
                        dropoffDateInput.value = '';
                    }
                }
            });
        }
    }
    linkDatePickers();
    // --- END of new block ---

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Sticky Header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // On-Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Homepage Booking Widget Logic
    const homepageBookingForm = document.getElementById('booking-form');
    if (homepageBookingForm) {
        homepageBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const location = document.getElementById('pickup-location').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const dropoffDate = document.getElementById('dropoff-date').value;
            if (!pickupDate || !dropoffDate) {
                alert('Please select both a pick-up and drop-off date.');
                return;
            }
            const queryParams = new URLSearchParams({
                location: location,
                pickup: pickupDate,
                dropoff: dropoffDate
            });
            window.location.href = `fleet.html?${queryParams.toString()}`;
        });
    }
});