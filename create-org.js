const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

const apiBaseUrl = 'http://your-server-ip:3000';  // Replace with your actual server IP

document.getElementById('orgForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const orgName = document.getElementById('orgName').value;
    const orgEmail = document.getElementById('orgEmail').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userEmail = document.getElementById('userEmail').value;

    const payload = {
        orgName,
        orgEmail,
        username,
        password,
        userEmail
    };

    try {
        console.log("yaha ak aaya");
        const response = await fetch(`${apiBaseUrl}/api/orgs/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Success
            alert('Organization and user created successfully!');
            // Optionally, redirect to login or dashboard
            window.location.href = '/login.html';
        } else {
            // Failure
            document.getElementById('message').textContent = data.message || 'Failed to create organization and user.';
        }
    } catch (error) {
        console.error('Error during org and user creation:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    }
});
