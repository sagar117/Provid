const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const payload = { username, password };

    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Login was successful
            alert('Login successful!');
            // Save token in localStorage or cookie
            localStorage.setItem('token', data.token);
            sessionStorage.setItem('refreshToken', data.refreshToken);
            console.log("Login Succesfull ");

            // Redirect user to dashboard or homepage
            window.location.href = '/dashboard.html';
        } else {
            // Handle login failure
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while trying to log in. Please try again.');
    }
});
