// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        try {
            // Send login credentials to the backend
            const response = await fetch('https://momentum-rides.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                // If login is successful, store a "logged in" flag in the browser's session storage
                sessionStorage.setItem('isAdminAuthenticated', 'true');
                // Redirect to the admin dashboard
                window.location.href = 'admin.html';
            } else {
                // If login fails, show the error message from the server
                errorMessage.textContent = result.message || 'Login failed. Please try again.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'An error occurred. Please check your connection and try again.';
        }
    });
});