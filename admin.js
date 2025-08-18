// admin.js - UPDATED with Security Check

document.addEventListener('DOMContentLoaded', () => {
    // === NEW: SECURITY GUARD ===
    // This check runs immediately when the page loads.
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');

    if (isAuthenticated !== 'true') {
        // If the user is NOT authenticated, redirect them to the login page.
        alert('You must be logged in to view this page.');
        window.location.href = 'login.html';
        return; // Stop the rest of the script from running
    }
    // If the check passes, the script continues to run as normal.
    // ===========================

    const bookingsTbody = document.getElementById('bookings-tbody');

    async function fetchBookings() {
        try {
            // Use your live Render URL here
            const response = await fetch('https://momentum-rides.onrender.com/api/bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error('Error:', error);
            bookingsTbody.innerHTML = `<tr><td colspan="7" class="error-row">Could not load bookings. Please try again.</td></tr>`;
        }
    }

    function displayBookings(bookings) {
        bookingsTbody.innerHTML = ''; // Clear the loading message

        if (bookings.length === 0) {
            bookingsTbody.innerHTML = `<tr><td colspan="7">No bookings found.</td></tr>`;
            return;
        }

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            const startDate = new Date(booking.startDate).toLocaleDateString();
            const endDate = new Date(booking.endDate).toLocaleDateString();
            const bookingDate = new Date(booking.bookingDate).toLocaleString();

            row.innerHTML = `
                <td>${booking.userName}</td>
                <td>${booking.userEmail}</td>
                <td>${booking.carName}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>₹${booking.totalCost.toLocaleString()}</td>
                <td>${bookingDate}</td>
            `;
            bookingsTbody.appendChild(row);
        });
    }

    fetchBookings();
});