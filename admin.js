// admin.js - UPDATED with Edit Modal Date Validation

document.addEventListener('DOMContentLoaded', () => {
    // Security check
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
        alert('You must be logged in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    // --- DOM Elements ---
    const bookingsTbody = document.getElementById('bookings-tbody');
    const logoutButton = document.getElementById('logout-button');
    const bookingModal = document.getElementById('booking-modal');
    const bookingModalTitle = document.getElementById('booking-modal-title');
    const bookingEditForm = document.getElementById('booking-edit-form');
    const bookingCancelBtn = document.getElementById('booking-cancel-btn');
    const locationSelect = document.getElementById('booking-location-select');

    let allBookings = [];

    // === NEW: Link Start and End Dates in Edit Modal ===
    function linkAdminDatePickers() {
        const startDateInput = document.getElementById('booking-start-date');
        const endDateInput = document.getElementById('booking-end-date');

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => {
                if (startDateInput.value) {
                    endDateInput.min = startDateInput.value;
                    // If the current end date is now invalid, clear it
                    if (endDateInput.value < startDateInput.value) {
                        endDateInput.value = '';
                    }
                }
            });
        }
    }

    // --- Functions ---

    // Fetches all bookings and locations
    async function initializePage() {
        try {
            const [bookingsResponse, locationsResponse] = await Promise.all([
                fetch('https://momentum-rides.onrender.com/api/bookings'),
                fetch('https://momentum-rides.onrender.com/api/locations')
            ]);
            if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
            if (!locationsResponse.ok) throw new Error('Failed to fetch locations');
            
            allBookings = await bookingsResponse.json();
            const locations = await locationsResponse.json();
            
            populateLocationDropdown(locations);
            displayBookings(allBookings);
        } catch (error) {
            console.error('Initialization Error:', error);
            bookingsTbody.innerHTML = `<tr><td colspan="7" class="error-row">Could not load bookings.</td></tr>`;
        }
    }

    // Populates the location dropdown in the edit modal
    function populateLocationDropdown(locations) {
        if (!locationSelect) return;
        locations.sort().forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    }

    // Displays the bookings in the table
    function displayBookings(bookings) {
        bookingsTbody.innerHTML = '';
        if (bookings.length === 0) {
            bookingsTbody.innerHTML = `<tr><td colspan="7">No bookings found.</td></tr>`;
            return;
        }
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            const startDate = new Date(booking.startDate).toLocaleDateString();
            const endDate = new Date(booking.endDate).toLocaleDateString();
            const bookingDate = new Date(booking.bookingDate).toLocaleString();
            const locationHTML = booking.location ? `<br><small><strong>Location:</strong> ${booking.location}</small>` : '';
            const statusDropdown = `
                <select class="status-select status-${booking.status.toLowerCase()}" data-id="${booking._id}">
                    <option value="Pending" ${booking.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Approved" ${booking.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    <option value="Declined" ${booking.status === 'Declined' ? 'selected' : ''}>Declined</option>
                    <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            `;

            row.innerHTML = `
                <td>${booking.userName}<br><small>${booking.userEmail}</small>${locationHTML}</td>
                <td>${booking.carName}</td>
                <td>${startDate} - ${endDate}</td>
                <td>₹${booking.totalCost.toLocaleString()}</td>
                <td>${bookingDate}</td>
                <td>${statusDropdown}</td>
                <td class="actions-cell">
                    <i class="action-icon icon-edit-booking fas fa-pencil-alt" data-id="${booking._id}" title="Edit Booking"></i>
                    <i class="action-icon icon-delete fas fa-trash-alt" data-id="${booking._id}" title="Delete Booking"></i>
                </td>
            `;
            bookingsTbody.appendChild(row);
        });
    }

    // Modal Functions
    function openBookingModal(bookingData) {
        if (!bookingData) return;
        bookingModalTitle.textContent = `Edit Booking for ${bookingData.userName}`;
        document.getElementById('booking-db-id').value = bookingData._id;
        document.getElementById('booking-user-name').value = bookingData.userName;
        document.getElementById('booking-user-email').value = bookingData.userEmail;
        
        const startDate = new Date(bookingData.startDate).toISOString().split('T')[0];
        const endDate = new Date(bookingData.endDate).toISOString().split('T')[0];
        
        document.getElementById('booking-start-date').value = startDate;
        document.getElementById('booking-end-date').value = endDate;
        // Set the min attribute for the end date when the modal opens
        document.getElementById('booking-end-date').min = startDate;

        locationSelect.value = bookingData.location || '';
        
        bookingModal.style.display = 'flex';
    }

    function closeBookingModal() {
        bookingModal.style.display = 'none';
    }

    // Handle Booking Edit Form Submission
    async function handleBookingFormSubmit(event) {
        event.preventDefault();
        const bookingId = document.getElementById('booking-db-id').value;

        const updatedData = {
            userName: document.getElementById('booking-user-name').value,
            userEmail: document.getElementById('booking-user-email').value,
            startDate: document.getElementById('booking-start-date').value,
            endDate: document.getElementById('booking-end-date').value,
            location: locationSelect.value
        };

        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Failed to update booking');
            
            closeBookingModal();
            initializePage();
        } catch (error) {
            console.error('Booking update error:', error);
            alert('Error: Could not save changes. Please try again.');
        }
    }

    // Update/Delete Status Functions
    async function updateBookingStatus(bookingId, newStatus) {
        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            
            initializePage(); 
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update booking status.');
        }
    }

    async function deleteBooking(bookingId) {
        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete booking');
            
            initializePage();
        } catch (error) {
            console.error('Delete Error:', error);
            alert('Failed to delete booking.');
        }
    }

    // --- Event Listeners ---
    bookingsTbody.addEventListener('click', (event) => {
        const target = event.target;
        const bookingId = target.dataset.id;

        if (target.matches('.icon-edit-booking')) {
            const bookingToEdit = allBookings.find(b => b._id === bookingId);
            openBookingModal(bookingToEdit);
        }
        if (target.matches('.icon-delete')) {
            if (confirm('Are you sure you want to permanently delete this booking?')) {
                deleteBooking(bookingId);
            }
        }
    });
    
    bookingsTbody.addEventListener('change', (event) => {
        if (event.target.matches('.status-select')) {
            const bookingId = event.target.dataset.id;
            const newStatus = event.target.value;
            updateBookingStatus(bookingId, newStatus);
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = 'login.html';
        });
    }

    // Modal Listeners
    bookingCancelBtn.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', (event) => {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
    bookingEditForm.addEventListener('submit', handleBookingFormSubmit);

    // Initial Load
    initializePage();
    linkAdminDatePickers(); // Call the new function
});