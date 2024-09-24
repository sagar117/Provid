const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP



document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const org_id = document.getElementById('org_id').value;

    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, org_id }),
        });

        const data = await response.json();
        document.getElementById('message').innerText = data.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});
