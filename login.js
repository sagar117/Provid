const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP


    document.getElementById('login-btn').addEventListener('click', async function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Send login request
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            if (!response.ok) {
                document.getElementById('error-msg').style.display = 'block';
                return;
            }

            const data = await response.json();
            const token = data.token;  // Assuming your backend returns a JWT or session token

            // Store token in chrome local storage
            chrome.storage.local.set({ authToken: token }, function() {
                console.log('Token saved successfully');
            });

            // Call the /me API to get user details
            const meResponse = await fetch(`${apiBaseUrl}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (!meResponse.ok) {
                console.error('Error fetching user details');
                return;
            }

            const userData = await meResponse.json();

            // Save user details and organization details to chrome local storage
            // chrome.storage.local.set({
            //     userDetails: userData.user,
            //     orgDetails: userData.organization
            // }, function() {
            //     console.log('User and Organization details saved');
            // });

            // Redirect or perform further actions after successful login
            window.location.href = 'dashboard.html';  // Redirect to dashboard page

        } catch (error) {
            console.error('Error during login:', error);
        }
    });
