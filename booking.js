document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & DOM ELEMENTS ---
    let selectedCar = null;
    let rentalDays = 0;
    let totalCost = 0;
    const carDetailsContainer = document.getElementById('car-details-container');
    const summaryContent = document.getElementById('summary-content');
    const bookingForm = document.getElementById('booking-form-final');
    const allInputs = document.querySelectorAll('#start-date, #end-date, input[name="extra"], #full-name, #email');

    // --- 1. INITIALIZE THE PAGE (Reads URL, fetches data, pre-fills fields) ---
    async function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');
        const location = urlParams.get('location');
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');

        // Pre-fill location if it exists
        if (location) {
            const locationDiv = document.getElementById('summary-location');
            locationDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> Pick-up: <strong>${location || "Jaipur"}</strong>`;
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
            
            // Call the functions to populate the page
            displayCarDetails(selectedCar);
            updateSummary();

        } catch (error) {
            console.error("Failed to fetch car details:", error);
            carDetailsContainer.innerHTML = `<p class="error-message">Error: Could not load car details.</p>`;
        }
    }

    // --- 2. DISPLAY CAR DETAILS (Includes price) ---
    function displayCarDetails(car) {
        carDetailsContainer.innerHTML = `
            <img src="${car.image_url}" alt="${car.name}" style="width: 300px;">
            <div>
                <h3>Your Selected Car</h3>
                <h2>${car.name}</h2>
                <p>Type: ${car.type} | Transmission: ${car.transmission}</p>
                <div class="car-price-display">
                    ₹${car.price_per_day.toLocaleString()}<span> / day</span>
                </div>
            </div>
        `;
    }

    // --- 3. CALCULATE AND UPDATE BOOKING SUMMARY ---
    function updateSummary() {
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
        totalCost = baseCost + extrasCost;
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
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedCar || rentalDays <= 0) {
            alert('Please select a car and valid rental dates before confirming.');
            return;
        }
        const bookingData = {
            carId: selectedCar.id,
            carName: selectedCar.name,
            userName: document.getElementById('full-name').value,
            userEmail: document.getElementById('email').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            totalCost: totalCost
        };
        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const result = await response.json();
            if (result.success) {
                alert('Booking Confirmed! A confirmation for your August 2025 trip will be sent shortly. Thank you!');
                window.location.href = 'index.html';
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert(`Booking failed: ${error.message}. Please try again.`);
        }
    });

    // --- INITIALIZE THE PAGE AND ADD EVENT LISTENERS ---
    initializePage();
    allInputs.forEach(input => input.addEventListener('change', updateSummary));
});