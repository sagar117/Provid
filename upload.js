const apiBaseUrl = 'http://34.71.54.137:3000'; // Replace with your actual server IP

// Fetch the recording data from local storage on page load
chrome.storage.local.get('recordingData', async (result) => {
    if (result.recordingData) {
        console.log("Recording data found:", result.recordingData);

        // Extract the necessary details
        const title = result.recordingData.name || 'Untitled Guide'; // Default name if not provided
        const description = result.recordingData.description || 'No description provided.'; // Default description

        // Assuming 'events' is stored in recordingData as an array of event objects
        const events = result.recordingData.events || [];

        // Fetch the token from local storage
        // chrome.storage.local.get(['token'], async (result) => {
        //     const token = result.token;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4Yzk5MDhmZTkxMjE4MTk5Zjc0MmEiLCJvcmdJZCI6IjY2ZjhjOTkwOGZlOTEyMTgxOTlmNzQyOCIsImlhdCI6MTcyNzU5MzY0MSwiZXhwIjoxNzI3NTk3MjQxfQ.7inOIjrPRxKN6FWMmRrjtXEbUXO8vZmH_4K1NyTTEFw';

            // if (!token) {
            //     console.error('Token not found');
            //     alert('Token not found. Please log in again.');
            //     return;
            // }

            // Construct the data object to send to the server
            const guideData = {
                title,
                description,
                events,
                // orgId: localStorage.getItem('orgId'), // Replace with the actual organization ID
            };

            // Sending the data to the server
            console.log("Token to send:", token);

            try {
                const response = await fetch(`${apiBaseUrl}/api/orgs/saveGuide`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include JWT token if needed
                    },
                    body: JSON.stringify(guideData),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("Guide saved successfully:", data);
                    alert('Guide saved successfully!');
                } else {
                    console.error("Error saving guide:", data.message);
                    alert('Failed to save guide: ' + data.message);
                }
            } catch (error) {
                console.error('Error during saving:', error);
                alert('An error occurred while saving the guide.');
            }
        // });
    } else {
        console.error("No recording data found.");
        alert("No recording data found.");
    }
});

// Save the recording data as a file on click (optional, can be retained)
document.getElementById('save-recording').addEventListener('click', () => {
    chrome.storage.local.get('recordingData', (result) => {
        if (result.recordingData) {
            const recordingData = result.recordingData;

            // Convert the recorded data to JSON string format
            const blob = new Blob([JSON.stringify(recordingData)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Create an anchor element to download the file
            const a = document.createElement('a');
            a.href = url;
            a.download = `${recordingData.name || 'recording'}_${Date.now()}.json`; // Generate a filename
            document.body.appendChild(a); // Append to the body
            a.click(); // Trigger the download
            a.remove(); // Remove the anchor element

            URL.revokeObjectURL(url); // Clean up
            console.log("Recording saved successfully!");
        } else {
            console.error("No recording data found.");
            alert("No recording data found.");
        }
    });
});


document.getElementById('fetch-guides').addEventListener('click', async () => {
    // const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4Yzk5MDhmZTkxMjE4MTk5Zjc0MmEiLCJvcmdJZCI6IjY2ZjhjOTkwOGZlOTEyMTgxOTlmNzQyOCIsImlhdCI6MTcyNzU5MzY0MSwiZXhwIjoxNzI3NTk3MjQxfQ.7inOIjrPRxKN6FWMmRrjtXEbUXO8vZmH_4K1NyTTEFw';
    const apiBaseUrl = 'http://34.71.54.137:3000'; // Replace with your actual server IP
    
    try {
        const response = await fetch(`${apiBaseUrl}/api/orgs/getGuides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const guides = await response.json();

        if (response.ok) {
            console.log("Guides retrieved successfully:", guides);
            displayGuides(guides);
        } else {
            console.error("Error retrieving guides:", guides.message);
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
    }
});

function displayGuides(guides) {
    const container = document.getElementById('guides-container');
    container.innerHTML = ''; // Clear previous data

    if (guides.length === 0) {
        container.innerHTML = '<p>No guides found.</p>';
        return;
    }

    guides.forEach(guide => {
        const guideElement = document.createElement('div');
        guideElement.innerHTML = `
            <h3>${guide.title}</h3>
            <p>${guide.description}</p>
            <pre>${JSON.stringify(guide.events, null, 2)}</pre>
        `;
        container.appendChild(guideElement);
    });
}
