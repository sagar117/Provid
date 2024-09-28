const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

document.getElementById('orgForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const orgName = document.getElementById('orgName').value;
    const orgEmail = document.getElementById('orgEmail').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userEmail = document.getElementById('userEmail').value;

    try {
        console.log("Yaha ak aaya");
        const response = await fetch(`${apiBaseUrl}/api/orgs/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Include token if necessary
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
        console.log("data:",data);
        document.getElementById('message').innerText = data.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});

