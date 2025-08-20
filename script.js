// script.js for index.html - UPDATED with Dynamic Locations

document.addEventListener('DOMContentLoaded', function() {
    
    // --- NEW: Fetch and populate pickup locations ---
    async function populateLocationsDropdown() {
        const locationSelect = document.getElementById('pickup-location');
        if (!locationSelect) return;

        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/locations');
            if (!response.ok) throw new Error('Failed to fetch locations');
            
            const locations = await response.json();
            
            locations.sort().forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error populating locations:', error);
            // Optionally, show an error to the user
            const errorOption = document.createElement('option');
            errorOption.textContent = 'Could not load locations';
            errorOption.disabled = true;
            locationSelect.appendChild(errorOption);
        }
    }

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

    // --- Link Start and End Dates ---
    function linkDatePickers() {
        const pickupDateInput = document.getElementById('pickup-date');
        const dropoffDateInput = document.getElementById('dropoff-date');

        if (pickupDateInput && dropoffDateInput) {
            pickupDateInput.addEventListener('change', () => {
                if (pickupDateInput.value) {
                    dropoffDateInput.min = pickupDateInput.value;
                    if (dropoffDateInput.value < pickupDateInput.value) {
                        dropoffDateInput.value = '';
                    }
                }
            });
        }
    }

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
            if (!location) {
                alert('Please select a pick-up location.');
                return;
            }
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

    // --- Initialize all homepage functions ---
    populateLocationsDropdown();
    setMinDateForPickers();
    linkDatePickers();
});