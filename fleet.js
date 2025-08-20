// fleet.js - UPDATED with Sorting Functionality

document.addEventListener('DOMContentLoaded', () => {
    const fleetGrid = document.getElementById('fleet-grid');
    const loader = document.getElementById('loader');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const carTypeFiltersContainer = document.getElementById('car-type-filters');
    const sortBySelect = document.getElementById('sort-by');

    let allCars = []; // This will be populated from the API call

    // Fetches all necessary data and initializes the page
    async function initializePage() {
        loader.style.display = 'block';
        fleetGrid.style.display = 'none';

        const urlParams = new URLSearchParams(window.location.search);
        const pickupDate = urlParams.get('pickup');
        const dropoffDate = urlParams.get('dropoff');
        let carsUrl = 'https://momentum-rides.onrender.com/api/cars';
        if (pickupDate && dropoffDate) {
            const queryParams = new URLSearchParams({ pickup: pickupDate, dropoff: dropoffDate });
            carsUrl += `?${queryParams.toString()}`;
        }
        const typesUrl = 'https://momentum-rides.onrender.com/api/cars/types';

        try {
            const [carsResponse, typesResponse] = await Promise.all([
                fetch(carsUrl),
                fetch(typesUrl)
            ]);
            if (!carsResponse.ok) throw new Error('Failed to fetch cars');
            if (!typesResponse.ok) throw new Error('Failed to fetch car types');
            
            allCars = await carsResponse.json();
            const carTypes = await typesResponse.json();

            populateTypeFilters(carTypes);
            setupPriceSlider(allCars);
            updateSearchInfo(pickupDate, dropoffDate, allCars.length);
            applyFilters();
            attachFilterEventListeners();

        } catch (error)
        {
            console.error("Could not initialize page:", error);
            fleetGrid.innerHTML = '<p>Sorry, we could not load the car listings. Please try again later.</p>';
        } finally {
            loader.style.display = 'none';
            fleetGrid.style.display = 'grid';
        }
    }

    // Dynamically creates the car type checkboxes
    function populateTypeFilters(types) {
        carTypeFiltersContainer.innerHTML = '';
        types.sort().forEach(type => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="type" value="${type}"> ${type}`;
            carTypeFiltersContainer.appendChild(label);
        });
    }

    // Sets the min and max for the price slider dynamically
    function setupPriceSlider(cars) {
        if (!priceRange || !priceValue || cars.length === 0) return;
        const prices = cars.map(car => car.price_per_day);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        priceRange.min = minPrice;
        priceRange.max = maxPrice;
        priceRange.value = maxPrice;
        priceValue.textContent = maxPrice.toLocaleString();
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

    // Applies the sidebar filters AND the sorting
    function applyFilters() {
        const typeFilters = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
        const transmissionFilters = Array.from(document.querySelectorAll('input[name="transmission"]:checked')).map(el => el.value);
        const maxPrice = priceRange ? priceRange.value : 9999;
        
        let filteredCars = allCars.filter(car => {
            const typeMatch = typeFilters.length === 0 || typeFilters.includes(car.type);
            const transmissionMatch = transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission);
            const priceMatch = car.price_per_day <= maxPrice;
            return typeMatch && transmissionMatch && priceMatch;
        });

        // === NEW SORTING LOGIC ===
        const sortBy = sortBySelect.value;
        if (sortBy === 'price-asc') {
            filteredCars.sort((a, b) => a.price_per_day - b.price_per_day);
        } else if (sortBy === 'price-desc') {
            filteredCars.sort((a, b) => b.price_per_day - a.price_per_day);
        }
        // If 'default', no sorting is needed.

        renderCars(filteredCars);
    }
    
    // Attaches event listeners to ALL filter inputs
    function attachFilterEventListeners() {
        const allFilterInputs = document.querySelectorAll('.filters input');
        allFilterInputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.addEventListener('change', applyFilters);
            } else if (input.type === 'range') {
                input.addEventListener('input', () => {
                    if (priceValue) {
                        priceValue.textContent = parseInt(input.value).toLocaleString();
                    }
                    applyFilters();
                });
            }
        });
        // Add event listener for the new sort dropdown
        sortBySelect.addEventListener('change', applyFilters);
    }

    // Initial load
    initializePage();
});