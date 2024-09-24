const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

document.getElementById('orgForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const orgName = document.getElementById('orgName').value;
    const orgEmail = document.getElementById('orgEmail').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userEmail = document.getElementById('userEmail').value;

    try {
        const response = await fetch(`${apiBaseUrl}/api/orgs/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orgName,
                orgEmail,
                user: {
                    username,
                    password,
                    email: userEmail,
                },
            }),
        });

        const data = await response.json();
        document.getElementById('message').innerText = data.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});

