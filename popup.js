let recording = false;
let events = [];

// Function to update button states based on recording status
function updateButtonStates(isRecording) {
  const startButton = document.getElementById('start-recording');
  const stopButton = document.getElementById('stop-recording');

  if (isRecording) {
    startButton.disabled = true;
    stopButton.disabled = false;
  } else {
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

// Check the current recording state from Chrome storage
chrome.storage.sync.get(['isRecording'], (result) => {
  const isRecording = result.isRecording || false; // Default to false if not set
  updateButtonStates(isRecording);
});

// Start recording
document.getElementById('start-recording').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== -1) {
      const tabId = tabs[0].id;


      // Start recording on the current tab
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: startRecording
      });

      // Save the recording state and update the buttons
      chrome.storage.sync.set({ isRecording: true });
      updateButtonStates(true);

      console.log('Recording started on tab ID:', tabId);
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

      // Stop recording on the current tab
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: stopRecording
      });

      // Save the recording state and update the buttons
      chrome.storage.sync.set({ isRecording: false });
      updateButtonStates(false);

      // Display the save recording form
      document.getElementById('record-info').style.display = 'block';
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

  const recordingData = {
    name,
    description,
    events
  };

  chrome.storage.local.set({ recordingData }, () => {
    console.log("Recording saved:", recordingData);
    // Implement uploading here if needed
  });
});

// Functions to start and stop recording
function startRecording() {
  events = [];
  document.addEventListener('click', logEvent);
}

function stopRecording() {
  document.removeEventListener('click', logEvent);
  console.log(events);
}

// Log events
function logEvent(event) {
  const eventDetails = {
    type: event.type,
    target: event.target.tagName,
    x: event.clientX,
    y: event.clientY,
    timestamp: Date.now()
  };
  events.push(eventDetails);
  console.log('Event logged:', eventDetails); // Logs each event in the console
}


