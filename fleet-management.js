// fleet-management.js - UPDATED with Dynamic Car Type Logic

document.addEventListener('DOMContentLoaded', () => {
    // --- Security Check ---
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
        alert('You must be logged in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    // --- DOM Elements ---
    const carsTbody = document.getElementById('cars-tbody');
    const addCarBtn = document.getElementById('add-car-btn');
    const modal = document.getElementById('car-modal');
    const modalTitle = document.getElementById('modal-title');
    const carForm = document.getElementById('car-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const logoutButton = document.getElementById('logout-button');
    const carTypeSelect = document.getElementById('car-type-select');
    const newCarTypeGroup = document.getElementById('new-car-type-group');
    const newCarTypeInput = document.getElementById('car-type-new');

    let allCars = [];
    let carTypes = [];

    // --- API URLs ---
    const CARS_API_URL = 'https://momentum-rides.onrender.com/api/cars';
    const TYPES_API_URL = 'https://momentum-rides.onrender.com/api/cars/types';

    // --- Functions ---

    // 1. Fetch all initial data (cars and types)
    async function initializePage() {
        try {
            // Fetch cars and types at the same time for efficiency
            const [carsResponse, typesResponse] = await Promise.all([
                fetch(CARS_API_URL),
                fetch(TYPES_API_URL)
            ]);
            if (!carsResponse.ok) throw new Error('Failed to fetch cars');
            if (!typesResponse.ok) throw new Error('Failed to fetch car types');
            
            allCars = await carsResponse.json();
            carTypes = await typesResponse.json();
            
            displayCars(allCars);
            populateCarTypeDropdown();
        } catch (error) {
            console.error('Initialization Error:', error);
            carsTbody.innerHTML = `<tr><td colspan="5" class="error-row">Could not load fleet data.</td></tr>`;
        }
    }

    // 2. Populate the car type dropdown menu
    function populateCarTypeDropdown() {
        carTypeSelect.innerHTML = ''; // Clear existing options
        carTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            carTypeSelect.appendChild(option);
        });
        // Add the 'Add New...' option at the end
        const addNewOption = document.createElement('option');
        addNewOption.value = 'add_new';
        addNewOption.textContent = 'Add New Type...';
        carTypeSelect.appendChild(addNewOption);
    }

    // 3. Display cars in the table
    function displayCars(cars) {
        carsTbody.innerHTML = '';
        if (cars.length === 0) {
            carsTbody.innerHTML = `<tr><td colspan="5">No cars in the fleet. Click 'Add New Car' to begin.</td></tr>`;
            return;
        }
        cars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.name}</td>
                <td>${car.type}</td>
                <td>₹${car.price_per_day.toLocaleString()}</td>
                <td class="actions-cell">
                    <i class="action-icon icon-edit fas fa-pencil-alt" data-id="${car.id}" title="Edit Car"></i>
                    <i class="action-icon icon-delete fas fa-trash-alt" data-id="${car.id}" title="Delete Car"></i>
                </td>
            `;
            carsTbody.appendChild(row);
        });
    }

    // 4. Modal Handling
    function openModal(mode = 'add', carData = null) {
        carForm.reset();
        newCarTypeGroup.style.display = 'none'; // Hide the new type field by default

        if (mode === 'add') {
            modalTitle.textContent = 'Add New Car';
            document.getElementById('car-db-id').value = '';
            document.getElementById('car-id').readOnly = false;
        } else if (mode === 'edit' && carData) {
            modalTitle.textContent = 'Edit Car';
            document.getElementById('car-db-id').value = carData._id;
            document.getElementById('car-id').value = carData.id;
            document.getElementById('car-id').readOnly = true;
            document.getElementById('car-name').value = carData.name;
            document.getElementById('car-price').value = carData.price_per_day;
            document.getElementById('car-passengers').value = carData.passengers;
            document.getElementById('car-luggage').value = carData.luggage;
            document.getElementById('car-transmission').value = carData.transmission;
            document.getElementById('car-image').value = carData.image_url;

            // Smartly handle the car type dropdown for editing
            if (carTypes.includes(carData.type)) {
                carTypeSelect.value = carData.type;
            } else {
                carTypeSelect.value = 'add_new';
                newCarTypeGroup.style.display = 'block';
                newCarTypeInput.value = carData.type;
            }
        }
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // 5. Handle Form Submission (Create or Update)
    async function handleFormSubmit(event) {
        event.preventDefault();
        const isEditing = !!document.getElementById('car-db-id').value;

        // Determine the car type from either the dropdown or the new input field
        let carType = carTypeSelect.value;
        if (carType === 'add_new') {
            carType = newCarTypeInput.value.trim();
            if (!carType) {
                alert('Please enter a name for the new car type.');
                return;
            }
        }

        const carData = {
            id: document.getElementById('car-id').value,
            name: document.getElementById('car-name').value,
            type: carType,
            price_per_day: document.getElementById('car-price').value,
            passengers: document.getElementById('car-passengers').value,
            luggage: document.getElementById('car-luggage').value,
            transmission: document.getElementById('car-transmission').value,
            image_url: document.getElementById('car-image').value,
        };

        const url = isEditing ? `${CARS_API_URL}/${carData.id}` : CARS_API_URL;
        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData)
            });
            if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} car`);
            
            closeModal();
            initializePage(); // Re-fetch everything to update the list and dropdown
        } catch (error) {
            console.error('Form submission error:', error);
            alert(`Error: Could not save the car. Please try again.`);
        }
    }

    // 6. Handle Car Deletion
    async function deleteCar(carId) {
        try {
            const response = await fetch(`${CARS_API_URL}/${carId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete car');
            initializePage(); // Re-fetch everything
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error: Could not delete the car.');
        }
    }

    // --- Event Listeners ---
    addCarBtn.addEventListener('click', () => openModal('add'));
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    carForm.addEventListener('submit', handleFormSubmit);

    // Show/hide the new car type input field
    carTypeSelect.addEventListener('change', () => {
        if (carTypeSelect.value === 'add_new') {
            newCarTypeGroup.style.display = 'block';
            newCarTypeInput.required = true;
        } else {
            newCarTypeGroup.style.display = 'none';
            newCarTypeInput.required = false;
        }
    });

    // Event Delegation for Edit/Delete icons
    carsTbody.addEventListener('click', (event) => {
        const target = event.target;
        const carId = target.dataset.id;
        if (target.matches('.icon-edit')) {
            const carToEdit = allCars.find(car => car.id == carId);
            if (carToEdit) openModal('edit', carToEdit);
        }
        if (target.matches('.icon-delete')) {
            if (confirm(`Are you sure you want to delete the car with ID ${carId}?`)) {
                deleteCar(carId);
            }
        }
    });

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = 'login.html';
        });
    }

    // --- Initial Load ---
    initializePage();
});