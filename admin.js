// admin.js - UPDATED with Status Management

document.addEventListener('DOMContentLoaded', () => {
    // Security check remains the same
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
        alert('You must be logged in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    const bookingsTbody = document.getElementById('bookings-tbody');

    async function fetchBookings() {
        try {
            const response = await fetch('https://momentum-rides.onrender.com/api/bookings');
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error('Error:', error);
            bookingsTbody.innerHTML = `<tr><td colspan="7" class="error-row">Could not load bookings.</td></tr>`;
        }
    }

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

            // Generate the HTML for the action buttons based on status
            let actionButtons = '';
            if (booking.status === 'Pending') {
                actionButtons = `
                    <button class="action-btn btn-approve" data-id="${booking._id}" data-status="Approved">Approve</button>
                    <button class="action-btn btn-decline" data-id="${booking._id}" data-status="Declined">Decline</button>
                `;
            }

            row.innerHTML = `
                <td>${booking.userName}<br><small>${booking.userEmail}</small></td>
                <td>${booking.carName}</td>
                <td>${startDate} - ${endDate}</td>
                <td>₹${booking.totalCost.toLocaleString()}</td>
                <td>${bookingDate}</td>
                <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                <td class="actions-cell">${actionButtons}</td>
            `;
            bookingsTbody.appendChild(row);
        });
    }

    async function updateBookingStatus(bookingId, newStatus) {
        try {
            const response = await fetch(`https://momentum-rides.onrender.com/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            
            // Refresh the table to show the change
            fetchBookings(); 
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update booking status.');
        }
    }

    // Event Delegation for action buttons
    bookingsTbody.addEventListener('click', (event) => {
        if (event.target.matches('.action-btn')) {
            const bookingId = event.target.dataset.id;
            const newStatus = event.target.dataset.status;
            if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) {
                updateBookingStatus(bookingId, newStatus);
            }
        }
    });

    // Logout button logic remains the same
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = 'login.html';
        });
    }

    fetchBookings();
});