// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Feature Recorder extension installed.");
});

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message); // Add this line

  if (message.action === "startRecording") {
    console.log("Recording started.");

    // Query the active tab and start recording
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: startRecording, // This should be in content.js
        }, () => {
          sendResponse({ status: "Recording started." });
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
        sendResponse({ status: "No active tab found or invalid tab ID." });
      }
    });

    return true;  // Indicate that the response is asynchronous
  } else if (message.action === "stopRecording") {
    console.log("Recording stopped.");

    // Query the active tab and stop recording
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: stopRecording, // This should be in content.js
        }, () => {
          sendResponse({ status: "Recording stopped." });
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
        sendResponse({ status: "No active tab found or invalid tab ID." });
      }
    });

    return true;  // Indicate that the response is asynchronous
  }else if (message.action === "saveRecording") {
    console.log("Saving recording:", message.data);
    
    // Save the recorded data to Chrome storage
    chrome.storage.local.set({ recordingData: message.data }, () => {
      console.log("Recording saved:", message.data);
      sendResponse({ status: "Recording saved." });
    });

    return true;  // Indicate that the response is asynchronouss

  } else {
    sendResponse({ status: "Unknown action." });
  }
});

// Placeholder functions to be executed in the content script context
function startRecording() {
  // This function will be defined in content.js
}

function stopRecording() {
  // This function will be defined in content.js
}
