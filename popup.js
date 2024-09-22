// Function to update button states based on recording status
function updateButtonStates(isRecording) {
  const startButton = document.getElementById('start-recording');
  const stopButton = document.getElementById('stop-recording');

  startButton.disabled = isRecording;
  stopButton.disabled = !isRecording;
}

// Check the current recording state from Chrome storage
chrome.storage.sync.get(['isRecording'], (result) => {
  const isRecording = result.isRecording || false;
  updateButtonStates(isRecording);
});

// Start recording
document.getElementById('start-recording').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== -1) {
      const tabId = tabs[0].id;

      // Send a message to the content script to start recording
      chrome.tabs.sendMessage(tabId, { action: 'startRecording' });

      // Update the recording state
      chrome.storage.sync.set({ isRecording: true });
      updateButtonStates(true);
    } else {
      console.error("No active tab found or invalid tab ID.");
    }
  });
});

// Stop recording
document.getElementById('stop-recording').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== -1) {
      const tabId = tabs[0].id;

      // Send a message to the content script to stop recording
      chrome.tabs.sendMessage(tabId, { action: 'stopRecording' });

      // Update the recording state
      chrome.storage.sync.set({ isRecording: false });
      updateButtonStates(false);

      // Display the save recording form
      document.getElementById('record-info').style.display = 'block';

        // Listen for the response with events
        chrome.runtime.onMessage.addListener((message) => {
          if (message.action === "recordingStopped") {
            const events = message.events || [];
            // Now you can handle the events, e.g., save them
            console.log("Received events:", events);
          }else{
            console.log("Didn't Received events:", events);

            
          }
        });
        

          console.log('Recording stopped on tab ID:', tabId);
        } else {
          console.error("No active tab found or invalid tab ID.");
        }
      });
    });

  // Save the recorded events
  document.getElementById('save-recording').addEventListener('click', () => {
    const name = document.getElementById('feature-name').value;
    const description = document.getElementById('feature-description').value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: 'getEvents' }, (response) => {
          console.log("vvvvvvvagh", response);
          if (response && response.events) {
            const events = response.events || [];
            const recordingData = {
              name,
              description,
              events
            };

            // Save the recording data to the background script
            chrome.runtime.sendMessage({ action: 'saveRecording', data: recordingData }, (response) => {
              console.log(response.status);
              alert(response.status); // Alert the user about the status
            });
          } else {
            console.error("No events recorded or response is invalid.");
          }
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
      }
    });
  });

  // Listen for the response with events
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "recordingStopped") {
    const events = message.events || [];
    console.log("Received events:", events);
    // You can add additional handling for events here if needed
  }
});


  // Load saved recordings
  document.getElementById('load-recording').addEventListener('click', () => {
    chrome.storage.local.get(['recordingData'], (result) => {
      if (result.recordingData) {
        const recordingData = result.recordingData;
        console.log("Retrieved recording data:", recordingData);
        document.getElementById('recorded-info').textContent = JSON.stringify(recordingData, null, 2);
      } else {
        console.log("No recording data found.");
        document.getElementById('recorded-info').textContent = "No recording data found.";
      }
    });

    document.getElementById('upload-btn').addEventListener('click', () => {
      // Open a new tab to the upload.html page
      chrome.tabs.create({
        url: chrome.runtime.getURL('upload.html')
      });
    });
    
  });
