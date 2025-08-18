// admin.js - REFACTORED with a single, interactive status dropdown

document.addEventListener('DOMContentLoaded', () => {
    // Security check remains the same
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
        alert('You must be logged in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    const bookingsTbody = document.getElementById('bookings-tbody');

    // Fetches all bookings from the server
    async function fetchBookings() {
        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/bookings');
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error('Error:', error);
            bookingsTbody.innerHTML = `<tr><td colspan="6" class="error-row">Could not load bookings.</td></tr>`;
        }
    }

// admin.js

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

            // === THIS IS THE UPDATED PART ===
            // We now create an <i> tag with Font Awesome classes
            row.innerHTML = `
                <td>${booking.userName}<br><small>${booking.userEmail}</small>${locationHTML}</td>
                <td>${booking.carName}</td>
                <td>${startDate} - ${endDate}</td>
                <td>₹${booking.totalCost.toLocaleString()}</td>
                <td>${bookingDate}</td>
                <td>${statusDropdown}</td>
                <td><i class="delete-icon fa-solid fa-trash-can" data-id="${booking._id}" title="Delete Booking"></i></td>
            `;
            bookingsTbody.appendChild(row);
        });
    }

    // Sends a request to the server to update a booking's status
    async function updateBookingStatus(bookingId, newStatus) {
        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            
            // No need to refresh the whole table, just gives user confidence
            console.log(`Status for booking ${bookingId} updated to ${newStatus}`);
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update booking status.');
            // If the update fails, we refresh the table to show the original state
            fetchBookings();
        }
    }

    // Event Delegation for the status dropdowns
    bookingsTbody.addEventListener('change', (event) => {
        if (event.target.matches('.status-select')) {
            const bookingId = event.target.dataset.id;
            const newStatus = event.target.value;
            // Update the dropdown's own color immediately for instant feedback
            event.target.className = `status-select status-${newStatus.toLowerCase()}`;
            // Send the update to the server
            updateBookingStatus(bookingId, newStatus);
        }
    });

    // Logout button logic
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = 'login.html';
        });
    }

    // Initial load of bookings when the page opens
    fetchBookings();
});