// booking.js - FINAL VERSION with pre-filled data

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & DOM ELEMENTS (no change) ---
    let selectedCar = null;
    let rentalDays = 0;
    let totalCost = 0;
    const carDetailsContainer = document.getElementById('car-details-container');
    const summaryContent = document.getElementById('summary-content');
    const bookingForm = document.getElementById('booking-form-final');
    const allInputs = document.querySelectorAll('#start-date, #end-date, input[name="extra"], #full-name, #email');

    // --- UPDATED INITIALIZE FUNCTION ---
    async function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');
        const location = urlParams.get('location');
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');

        // Pre-fill location if it exists
        if (location) {
            const locationDiv = document.getElementById('summary-location');
            locationDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> Pick-up: <strong>${location}</strong>`;
        }

        // Pre-fill date inputs if they exist
        if (pickupDate && dropoffDate) {
            document.getElementById('start-date').value = pickupDate;
            document.getElementById('end-date').value = dropoffDate;
        }

        if (!carId) {
            carDetailsContainer.innerHTML = '<p>No car selected. Please <a href="fleet.html">return to the fleet page</a>.</p>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/cars/${carId}`);
            if (!response.ok) throw new Error('Car not found on the server.');
            selectedCar = await response.json();
            
            displayCarDetails(selectedCar);
            updateSummary(); // This will now calculate the price immediately with the pre-filled dates

        } catch (error) {
            console.error("Failed to fetch car details:", error);
            carDetailsContainer.innerHTML = `<p class="error-message">Error: Could not load car details.</p>`;
        }
    }

    // --- displayCarDetails function remains the same ---
    function displayCarDetails(car) { /* ... same as before ... */ }

    // --- updateSummary function remains the same ---
    function updateSummary() { /* ... same as before ... */ }
    
    // --- Form submission logic remains the same ---
    bookingForm.addEventListener('submit', async (e) => { /* ... same as before ... */ });

    // --- INITIALIZE THE PAGE AND ADD EVENT LISTENERS ---
    initializePage();
    allInputs.forEach(input => input.addEventListener('change', updateSummary));
});