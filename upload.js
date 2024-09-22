 // Directly access chrome local storage on page load
 chrome.storage.local.get('recordingData', (result) => {
    console.log(result.recordingData);
    if (result.recordingData) {
        console.log("Recording data found:", result.recordingData);

        // You can display or process the data here as needed
        const recordingData = result.recordingData;

        // Add logic to show recording data or use it in any way
        // For example, you can log the events or display them
        console.log("Events:", recordingData.events);
    } else {
        console.error("No recording data found.");
    }
});

// Save the recording data as a file on click
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
        }
    });
});