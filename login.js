const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP


    document.getElementById('login-btn').addEventListener('click', async function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            loginError.textContent = 'Please fill in both fields';
            return;
          }
        
        
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
        
            console.log("Response status:", response.status); // Log response status
            console.log("Response data:", data.token); // Log response data for debugging
        
            if (response.ok) {
                // Login was successful
                alert('Login successful!');
                // Save token in localStorage or session storage
                localStorage.setItem('token', data.token);
                const authToken = data.token;
                // chrome.storage.local.set({ authToken: authToken }, function() {
                //   console.log('Auth token is saved.');
                // });
                sessionStorage.setItem('refreshToken', data.refreshToken);
                // org_name = data.user.org
    
            // Call the /me API to get user details
            const meResponse = await fetch(`${apiBaseUrl}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': authToken,
                },
            });

            if (!meResponse.ok) {
                console.error('Error fetching user details');
                return;
            }

            const userData = await meResponse.json();

            // Save user details and organization details to chrome local storage
            chrome.storage.local.set({
                userDetails: userData.user,
                orgDetails: userData.organization
            }, function() {
                console.log('User and Organization details saved');
            });

            // Redirect or perform further actions after successful login
            window.location.href = 'dashboard.html';  // Redirect to dashboard page
        } else {
            // Handle login failure
            alert(data.message || 'Login failed');
        }

        } catch (error) {
            console.error('Error during login:', error);
        }
    
    });
