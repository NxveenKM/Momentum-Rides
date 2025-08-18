// fleet.js - UPDATED with Dynamic Price Slider

document.addEventListener('DOMContentLoaded', () => {
    const fleetGrid = document.getElementById('fleet-grid');
    const loader = document.getElementById('loader');
    const filters = document.querySelectorAll('.filters input');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    let allCars = []; // This will be populated from the API call

    // Fetches cars and sets up the page
    async function fetchCars() {
        loader.style.display = 'block';
        fleetGrid.style.display = 'none';

        const urlParams = new URLSearchParams(window.location.search);
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');
        let fetchUrl = 'https://momentum-rides.onrender.com/api/cars';
        if (pickupDate && dropoffDate) {
            const queryParams = new URLSearchParams({
                pickup: pickupDate,
                dropoff: dropoffDate
            });
            fetchUrl += `?${queryParams.toString()}`;
        }

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const carsFromAPI = await response.json();
            allCars = carsFromAPI;

            // THIS IS THE FIX: Setup the price slider based on the fetched cars
            setupPriceSlider(allCars); 

            updateSearchInfo(pickupDate, dropoffDate, allCars.length);
            applyFilters(); // Apply initial filters
        } catch (error) {
            console.error("Could not fetch cars:", error);
            fleetGrid.innerHTML = '<p>Sorry, we could not load the car listings. Please try again later.</p>';
        } finally {
            loader.style.display = 'none';
            fleetGrid.style.display = 'grid';
        }
    }

    // NEW FUNCTION: Sets the min and max for the price slider dynamically
    function setupPriceSlider(cars) {
        if (!priceRange || !priceValue || cars.length === 0) return;

        // Find the lowest and highest prices from the fetched cars
        const prices = cars.map(car => car.price_per_day);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        priceRange.min = minPrice;
        priceRange.max = maxPrice;
        priceRange.value = maxPrice; // Default the slider to the max value
        priceValue.textContent = maxPrice.toLocaleString(); // Display the max value
    }

    // Displays the dynamic search message
    function updateSearchInfo(pickup, dropoff, carCount) {
        const existingInfo = document.querySelector('.search-info');
        if (existingInfo) existingInfo.remove();
        
        if (pickup && dropoff) {
            const searchInfo = document.createElement('div');
            searchInfo.className = 'search-info';
            searchInfo.innerHTML = `<p>Found <strong>${carCount} available cars</strong> for your selected dates: <strong>${pickup}</strong> to <strong>${dropoff}</strong>.</p>`;
            const pageContainer = document.querySelector('.page-container');
            pageContainer.insertBefore(searchInfo, document.querySelector('.fleet-layout'));
        }
    }

    // Renders the filtered list of cars to the page
    function renderCars(carArray) {
        fleetGrid.innerHTML = '';
        if (carArray.length === 0) {
            fleetGrid.innerHTML = '<p>No cars match your criteria or are available for the selected dates.</p>';
            return;
        }

        const currentUrlParams = new URLSearchParams(window.location.search);
        carArray.forEach(car => {
            const carCard = document.createElement('div');
            const bookingLink = new URLSearchParams({ carId: car.id });
            if (currentUrlParams.has('location')) bookingLink.append('location', currentUrlParams.get('location'));
            if (currentUrlParams.has('pickup')) bookingLink.append('pickup', currentUrlParams.get('pickup'));
            if (currentUrlParams.has('dropoff')) bookingLink.append('dropoff', currentUrlParams.get('dropoff'));

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
                        <span class="price">₹${car.price_per_day.toLocaleString()} <span>/ day</span></span>
                        <a href="booking.html?${bookingLink.toString()}" class="btn-card">Book Now</a>
                    </div>
                </div>
            `;
            fleetGrid.appendChild(carCard);
        });
    }

    // Applies the sidebar filters
    function applyFilters() {
        const typeFilters = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
        const transmissionFilters = Array.from(document.querySelectorAll('input[name="transmission"]:checked')).map(el => el.value);
        const maxPrice = priceRange ? priceRange.value : 9999; // Use a high fallback

        let filteredCars = allCars.filter(car => {
            const typeMatch = typeFilters.length === 0 || typeFilters.includes(car.type);
            const transmissionMatch = transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission);
            const priceMatch = car.price_per_day <= maxPrice;
            return typeMatch && transmissionMatch && priceMatch;
        });

        renderCars(filteredCars);
    }
    
    // Event listeners for sidebar filters
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            if (priceValue) {
                priceValue.textContent = parseInt(e.target.value).toLocaleString();
            }
            applyFilters();
        });
    }
    filters.forEach(filter => {
        if (filter.type === 'checkbox') {
            filter.addEventListener('change', applyFilters);
        }
    });

    // Initial load
    fetchCars();
});