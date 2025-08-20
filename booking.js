// booking.js - UPDATED with Correct Same-Day Rental Calculation

document.addEventListener('DOMContentLoaded', () => {
    // --- Disable Past Dates in Booking Form ---
    function setMinDateForPickers() {
        const today = new Date().toISOString().split('T')[0];
        const pickupDateInput = document.getElementById('start-date');
        const dropoffDateInput = document.getElementById('end-date');
        if (pickupDateInput) pickupDateInput.setAttribute('min', today);
        if (dropoffDateInput) dropoffDateInput.setAttribute('min', today);
    }

    // --- Link Start and End Dates ---
    function linkDatePickers() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => {
                if (startDateInput.value) {
                    endDateInput.min = startDateInput.value;
                    if (endDateInput.value < startDateInput.value) {
                        endDateInput.value = '';
                        updateSummary();
                    }
                }
            });
        }
    }

    // --- STATE & DOM ELEMENTS ---
    let selectedCar = null;
    let rentalDays = 0;
    let totalCost = 0;
    const carDetailsContainer = document.getElementById('car-details-container');
    const summaryContent = document.getElementById('summary-content');
    const bookingForm = document.getElementById('booking-form-final');
    const allInputs = document.querySelectorAll('#start-date, #end-date, input[name="extra"], #full-name, #email, #booking-location-select');
    const locationSelect = document.getElementById('booking-location-select');

    // --- Fetch and populate pickup locations ---
    async function populateLocationsDropdown() {
        if (!locationSelect) return;
        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/locations');
            if (!response.ok) throw new Error('Failed to fetch locations');
            const locations = await response.json();
            
            locationSelect.innerHTML = '<option value="" disabled selected>Select a location</option>';
            
            locations.sort().forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
            const urlParams = new URLSearchParams(window.location.search);
            const locationFromUrl = urlParams.get('location');
            if (locationFromUrl && locations.includes(locationFromUrl)) {
                locationSelect.value = locationFromUrl;
            }
        } catch (error) {
            console.error('Error populating locations:', error);
            locationSelect.innerHTML = '<option value="" disabled selected>Could not load locations</option>';
        }
    }

    // --- 1. INITIALIZE THE PAGE ---
    async function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');

        if (pickupDate && dropoffDate) {
            document.getElementById('start-date').value = pickupDate;
            document.getElementById('end-date').value = dropoffDate;
            document.getElementById('end-date').min = pickupDate;
        }
        if (!carId) {
            carDetailsContainer.innerHTML = '<p>No car selected. Please <a href="fleet.html">return to the fleet page</a>.</p>';
            return;
        }

        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/cars/${carId}`);
            if (!response.ok) throw new Error('Car not found on the server.');
            selectedCar = await response.json();
            displayCarDetails(selectedCar);
            updateSummary();
        } catch (error) {
            console.error("Failed to fetch car details:", error);
            carDetailsContainer.innerHTML = `<p class="error-message">Error: Could not load car details.</p>`;
        }
    }

    // --- 2. DISPLAY CAR DETAILS ---
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

    // --- 3. CALCULATE AND UPDATE BOOKING SUMMARY (UPDATED) ---
    function updateSummary() {
        if (!selectedCar) {
            summaryContent.innerHTML = '<p>Please complete your booking details.</p>';
            return;
        }
        const location = locationSelect.value;
        const startDateValue = document.getElementById('start-date').value;
        const endDateValue = document.getElementById('end-date').value;
        
        rentalDays = 0;
        if (startDateValue && endDateValue) {
            const startDate = new Date(startDateValue);
            const endDate = new Date(endDateValue);

            if (endDate >= startDate) {
                // === THIS IS THE FIX ===
                // Calculate the difference in milliseconds
                const timeDiff = endDate.getTime() - startDate.getTime();
                // Convert milliseconds to days and round up
                const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                // A same-day rental will be 0 days, so we set it to a minimum of 1
                rentalDays = dayDiff === 0 ? 1 : dayDiff;
            }
        }

        const baseCost = selectedCar.price_per_day * rentalDays;
        let extrasCost = 0;
        document.querySelectorAll('input[name="extra"]:checked').forEach(extra => {
            extrasCost += parseInt(extra.dataset.price) * rentalDays;
        });
        totalCost = baseCost + extrasCost;

        // Build the new summary HTML
        let summaryHTML = `
            <div class="summary-item">
                <span class="summary-label">Location</span>
                <span class="summary-value">${location || 'Not selected'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Dates</span>
                <span class="summary-value">${startDateValue && endDateValue ? `${startDateValue} to ${endDateValue}` : 'Not selected'}</span>
            </div>
            <hr class="summary-divider">
        `;

        if (rentalDays > 0) {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">${selectedCar.name} (${rentalDays} day${rentalDays > 1 ? 's' : ''})</span>
                    <span class="summary-value">₹${baseCost.toLocaleString()}</span>
                </div>
            `;
        }
        
        if (extrasCost > 0) {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">Extras</span>
                    <span class="summary-value">₹${extrasCost.toLocaleString()}</span>
                </div>
            `;
        }

        if (rentalDays > 0) {
            summaryHTML += `
                <hr class="summary-divider">
                <div class="summary-total">
                    <span>Total Cost</span>
                    <span>₹${totalCost.toLocaleString()}</span>
                </div>
            `;
        } else {
            summaryHTML += `<p>Please select valid dates to see the cost.</p>`;
        }

        summaryContent.innerHTML = summaryHTML;
    }
    
    // --- 4. HANDLE FORM SUBMISSION ---
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedCar || rentalDays <= 0 || !locationSelect.value) {
            alert('Please select a car, location, and valid rental dates before confirming.');
            return;
        }
        const bookingData = {
            carId: selectedCar.id,
            carName: selectedCar.name,
            userName: document.getElementById('full-name').value,
            userEmail: document.getElementById('email').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            totalCost: totalCost,
            location: locationSelect.value
        };
        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const result = await response.json();
            if (result.success) {
                alert('Booking Confirmed! A confirmation for your trip will be sent shortly. Thank you!');
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
    setMinDateForPickers();
    linkDatePickers();
    populateLocationsDropdown();
    initializePage();
    allInputs.forEach(input => input.addEventListener('change', updateSummary));
});