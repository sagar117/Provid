const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP


document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        document.getElementById('message').innerText = data.message;

        if (data.token) {
            // Store the token in localStorage or handle it as needed
            localStorage.setItem('token', data.token);
            // Redirect to another page if needed
            // window.location.href = '/dashboard';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});
