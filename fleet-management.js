// fleet-management.js - FINAL CORRECTED VERSION

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

    let allCars = []; // To store the fetched car data

    // --- API URL ---
    const API_URL = 'https://momentum-rides.onrender.com/api/cars';

    // --- Functions ---

    // 1. Fetch all cars from the server
    async function fetchCars() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch cars');
            allCars = await response.json();
            displayCars(allCars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            carsTbody.innerHTML = `<tr><td colspan="5" class="error-row">Could not load fleet.</td></tr>`;
        }
    }

    // 2. Display cars in the table
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

    // 3. Modal Handling
    function openModal(mode = 'add', carData = null) {
        carForm.reset();
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
            document.getElementById('car-type').value = carData.type;
            document.getElementById('car-price').value = carData.price_per_day;
            document.getElementById('car-passengers').value = carData.passengers;
            document.getElementById('car-luggage').value = carData.luggage;
            document.getElementById('car-transmission').value = carData.transmission;
            document.getElementById('car-image').value = carData.image_url;
        }
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // 4. Handle Form Submission (Create or Update)
    async function handleFormSubmit(event) {
        event.preventDefault();
        const isEditing = !!document.getElementById('car-db-id').value;

        const carData = {
            id: document.getElementById('car-id').value,
            name: document.getElementById('car-name').value,
            type: document.getElementById('car-type').value,
            price_per_day: document.getElementById('car-price').value,
            passengers: document.getElementById('car-passengers').value,
            luggage: document.getElementById('car-luggage').value,
            transmission: document.getElementById('car-transmission').value,
            image_url: document.getElementById('car-image').value,
        };

        const url = isEditing ? `${API_URL}/${carData.id}` : API_URL;
        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData)
            });
            if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} car`);
            
            closeModal();
            fetchCars();
        } catch (error) {
            console.error('Form submission error:', error);
            alert(`Error: Could not save the car. Please try again.`);
        }
    }

    // 5. Handle Car Deletion
    async function deleteCar(carId) {
        try {
            const response = await fetch(`${API_URL}/${carId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete car');
            fetchCars();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error: Could not delete the car.');
        }
    }

    // --- Event Listeners ---

    addCarBtn.addEventListener('click', () => openModal('add'));

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    carForm.addEventListener('submit', handleFormSubmit);

    // === THIS IS THE CORRECTED PART ===
    // The event listener now looks for the correct icon classes
    carsTbody.addEventListener('click', (event) => {
        const target = event.target;
        const carId = target.dataset.id;

        if (target.matches('.icon-edit')) {
            const carToEdit = allCars.find(car => car.id == carId);
            if (carToEdit) {
                openModal('edit', carToEdit);
            }
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
    fetchCars();
});