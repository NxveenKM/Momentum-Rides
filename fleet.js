// fleet.js - MODIFIED to fetch from the backend API

// REMOVE the local import, we don't need it anymore
// import { cars } from './cars.js';

document.addEventListener('DOMContentLoaded', () => {
    const fleetGrid = document.getElementById('fleet-grid');
    const loader = document.getElementById('loader');
    const filters = document.querySelectorAll('.filters input');

        function handleHomepageSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');

        if (pickupDate && dropoffDate) {
            console.log(`Search initiated from homepage for dates: ${pickupDate} to ${dropoffDate}`);

            // Create a message to show the user their search is acknowledged
            const searchInfo = document.createElement('div');
            searchInfo.className = 'search-info';
            searchInfo.innerHTML = `
                <p>Showing all available cars. Your selected dates: <strong>${pickupDate}</strong> to <strong>${dropoffDate}</strong>.</p>
                <small>(Live date-based filtering is coming soon!)</small>
            `;

            // Insert this message before the fleet layout
            const pageContainer = document.querySelector('.page-container');
            pageContainer.insertBefore(searchInfo, document.querySelector('.fleet-layout'));
        }
    }

    let allCars = []; // This will be populated from the API call

    // --- 1. FETCH CAR DATA FROM OUR NEW BACKEND ---
    async function fetchCars() {
        loader.style.display = 'block';
        fleetGrid.style.display = 'none';

        try {
            // Use the browser's fetch API to make a request to our server
            const response = await fetch('https://momentum-rides.onrender.com');
            
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

    // --- 2. RENDER CARS TO THE PAGE (UPDATED) ---
    function renderCars(carArray) {
        fleetGrid.innerHTML = '';
        if (carArray.length === 0) {
            fleetGrid.innerHTML = '<p>No cars match your criteria.</p>';
            return;
        }

        // Get the search parameters from the current page's URL
        const currentUrlParams = new URLSearchParams(window.location.search);

        carArray.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';

            // Start building the link for the booking page
            const bookingLink = new URLSearchParams({
                carId: car.id
            });

            // Carry forward the homepage search parameters if they exist
            if (currentUrlParams.has('location')) {
                bookingLink.append('location', currentUrlParams.get('location'));
            }
            if (currentUrlParams.has('pickup')) {
                bookingLink.append('pickup', currentUrlParams.get('pickup'));
            }
            if (currentUrlParams.has('dropoff')) {
                bookingLink.append('dropoff', currentUrlParams.get('dropoff'));
            }

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
                        <a href="booking.html?${bookingLink.toString()}" class="btn-card">Book Now</a>
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
    handleHomepageSearch(); // First, check for parameters from the homepage
    fetchCars();          // Second, fetch the car data from the server
});

