// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Feature Recorder extension installed.");
});


// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startRecording") {
    console.log("Recording started.");

    // Query the active tab and start recording
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: startRecording
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
      }
    });


    sendResponse({ status: "Recording started." });
  } else if (message.action === "stopRecording") {
    console.log("Recording stopped.");

    // Query the active tab and stop recording
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: stopRecording
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
      }
    });


    sendResponse({ status: "Recording stopped." });
  } else if (message.action === "saveRecording") {
    console.log("Saving recording:", message.data);

    // Convert the recorded data to JSON string format
    const blob = new Blob([JSON.stringify(message.data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Use chrome.downloads API to download the file
    chrome.downloads.download({
      url: url,
      filename: `recording_${Date.now()}.json`, // Create a unique filename
      saveAs: true  // This will prompt the user where to save the file
    }, (downloadId) => {
      if (downloadId) {
        console.log("Recording saved with downloadId:", downloadId);
        sendResponse({ status: "Recording saved." });
      } else {
        console.error("Error saving the recording.");
        sendResponse({ status: "Error saving the recording." });
      }
    });

    return true;  // Indicate that the response is asynchronous
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
