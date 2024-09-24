const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${config.apiBaseUrl}/api/auth/register`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    })
    .then(data => {
        console.log('Registration successful:', data);
        window.location.href = '/login'; // Redirect to the login page
    })
    .catch(error => console.error('Error:', error));
});

