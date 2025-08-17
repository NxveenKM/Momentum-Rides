// fleet.js - MODIFIED to fetch from the backend API

// REMOVE the local import, we don't need it anymore
// import { cars } from './cars.js';

document.addEventListener('DOMContentLoaded', () => {
    const fleetGrid = document.getElementById('fleet-grid');
    const loader = document.getElementById('loader');
    const filters = document.querySelectorAll('.filters input');

    let allCars = []; // This will be populated from the API call

    // --- 1. FETCH CAR DATA FROM OUR NEW BACKEND ---
    async function fetchCars() {
        loader.style.display = 'block';
        fleetGrid.style.display = 'none';

        try {
            // Use the browser's fetch API to make a request to our server
            const response = await fetch('http://localhost:3000/api/cars');
            
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response from the server
            const carsFromAPI = await response.json();
            
            allCars = carsFromAPI; // Store the fetched data
            renderCars(allCars); // Render the cars on the page

        } catch (error) {
            console.error("Could not fetch cars:", error);
            fleetGrid.innerHTML = '<p>Sorry, we could not load the car listings. Please try again later.</p>';
        } finally {
            // Hide loader and show grid regardless of success or failure
            loader.style.display = 'none';
            fleetGrid.style.display = 'grid';
        }
    }

    // --- 2. RENDER CARS TO THE PAGE (This function remains the same) ---
    function renderCars(carArray) {
        fleetGrid.innerHTML = ''; // Clear existing cars
        if (carArray.length === 0) {
            fleetGrid.innerHTML = '<p>No cars match your criteria.</p>';
            return;
        }

        carArray.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <img src="${car.image_url}" alt="${car.name}">
                <div class="card-content">
                    <h3>${car.name}</h3>
                    <p>${car.type}</p>
                    <div class="car-features">
                        <span><i class="fas fa-user-friends"></i> ${car.passengers}</span>
                        <span><i class="fas fa-suitcase"></i> ${car.luggage}</span>
                        <span><i class="fas fa-cogs"></i> ${car.transmission}</span>
                    </div>
                    <div class="price-section">
                        <span class="price">₹${car.price_per_day} <span>/ day</span></span>
                        <a href="booking.html?carId=${car.id}" class="btn-card">Book Now</a>
                    </div>
                </div>
            `;
            fleetGrid.appendChild(carCard);
        });
    }

    // --- 3. HANDLE FILTERING LOGIC (This function remains the same) ---
    function applyFilters() {
        const typeFilters = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
        const transmissionFilters = Array.from(document.querySelectorAll('input[name="transmission"]:checked')).map(el => el.value);
        const maxPrice = document.getElementById('price-range').value;

        let filteredCars = allCars.filter(car => {
            const typeMatch = typeFilters.length === 0 || typeFilters.includes(car.type);
            const transmissionMatch = transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission);
            const priceMatch = car.price_per_day <= maxPrice;
            return typeMatch && transmissionMatch && priceMatch;
        });

        renderCars(filteredCars);
    }
    
    // Event listeners and price slider code remain the same...
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    priceRange.addEventListener('input', (e) => {
        priceValue.textContent = e.target.value;
    });
    filters.forEach(filter => filter.addEventListener('change', applyFilters));

    // --- INITIALIZE THE PAGE ---
    fetchCars(); // This single call now handles fetching AND initial rendering
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