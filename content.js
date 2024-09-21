// content.js
let isRecording = false;
let events = [];

// Start recording
function startRecording() {
  if (!isRecording) {
    events = [];
    isRecording = true;
    document.addEventListener('click', logEvent);
    console.log("Recording started");
  }
}

// Stop recording
function stopRecording() {
  if (isRecording) {
    document.removeEventListener('click', logEvent);
    isRecording = false;
    console.log("Recording stopped");
  }
}

// Log the events
function logEvent(event) {
  const eventDetails = {
    type: event.type,
    target: event.target.tagName,
    x: event.clientX,
    y: event.clientY,
    timestamp: Date.now()
  };

  events.push(eventDetails);
  // You can log the event in the DevTools of the webpage
  console.log("Event recorded:", eventDetails);

  // Optionally, send the event data to the background script
  chrome.runtime.sendMessage({ action: 'logEvent', eventDetails });
}
