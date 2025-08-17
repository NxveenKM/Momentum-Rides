// booking.js - FINAL, ROBUST VERSION

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let selectedCar = null;
    let rentalDays = 0;

    // --- DOM ELEMENTS ---
    const carDetailsContainer = document.getElementById('car-details-container');
    const summaryContent = document.getElementById('summary-content');
    const bookingForm = document.getElementById('booking-form-final');
    const allInputs = document.querySelectorAll('#start-date, #end-date, input[name="extra"]');

    // --- 1. GET CAR ID FROM URL AND FETCH DETAILS ---
    async function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');

        if (!carId) {
            carDetailsContainer.innerHTML = '<p>No car selected. Please <a href="fleet.html">return to the fleet page</a> to choose a car.</p>';
            return;
        }

        try {
            // Fetch data for the specific car from our backend
            const response = await fetch(`http://localhost:3000/api/cars/${carId}`);
            if (!response.ok) {
                // This handles cases where the ID is invalid (e.g., carId=99)
                throw new Error('Car not found on the server.');
            }
            selectedCar = await response.json();
            
            // If successful, display the details and update the summary
            displayCarDetails(selectedCar);
            updateSummary();

        } catch (error) {
            console.error("Failed to fetch car details:", error);
            carDetailsContainer.innerHTML = `<p class="error-message">Error: Could not load car details. Please ensure the server is running and the car ID is correct.</p>`;
        }
    }

    // --- 2. DISPLAY CAR DETAILS ---
    function displayCarDetails(car) {
        // This function injects the HTML for the car details, including the image
        carDetailsContainer.innerHTML = `
            <img src="${car.image_url}" alt="${car.name}">
            <div>
                <h3>Your Selected Car</h3>
                <h2>${car.name}</h2>
                <p>Type: ${car.type} | Transmission: ${car.transmission}</p>
            </div>
        `;
    }

    // --- 3. CALCULATE AND UPDATE BOOKING SUMMARY ---
    function updateSummary() {
        // This check is crucial. If we don't have a selected car, we can't calculate a price.
        if (!selectedCar) {
            summaryContent.innerHTML = '<p>Please select a valid car to see the summary.</p>';
            return;
        }

        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);

        rentalDays = 0;
        if (endDate > startDate) {
            const timeDiff = endDate.getTime() - startDate.getTime();
            rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }

        const baseCost = selectedCar.price_per_day * rentalDays;
        
        let extrasCost = 0;
        document.querySelectorAll('input[name="extra"]:checked').forEach(extra => {
            extrasCost += parseInt(extra.dataset.price) * rentalDays;
        });

        const totalCost = baseCost + extrasCost;

        if (rentalDays > 0) {
            summaryContent.innerHTML = `
                <div class="summary-line">
                    <span>${selectedCar.name} (₹${selectedCar.price_per_day.toLocaleString()} x ${rentalDays} days)</span>
                    <span>₹${baseCost.toLocaleString()}</span>
                </div>
                <div class="summary-line">
                    <span>Extras Cost</span>
                    <span>₹${extrasCost.toLocaleString()}</span>
                </div>
                <div class="summary-total">
                    <span>Total Cost</span>
                    <span>₹${totalCost.toLocaleString()}</span>
                </div>
            `;
        } else {
            summaryContent.innerHTML = '<p>Please select valid pick-up and drop-off dates.</p>';
        }
    }
    
    // --- 4. HANDLE FORM SUBMISSION ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!selectedCar || rentalDays <= 0) {
            alert('Please select a car and valid rental dates before confirming.');
            return;
        }
        // In a real app, this would send all form data to a POST /api/bookings endpoint
        alert(`Booking Confirmed for ${selectedCar.name}! (This is a demo). Total: ₹${(selectedCar.price_per_day * rentalDays)}. Confirmation for your August ${startDate.getDate()}, 2025 trip will be sent shortly.`);
        window.location.href = 'index.html';
    });

    // --- INITIALIZE THE PAGE AND ADD EVENT LISTENERS ---
    initializePage();
    allInputs.forEach(input => input.addEventListener('change', updateSummary));
});