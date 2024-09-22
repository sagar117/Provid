console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);

let events = [];


// Utility function to calculate the XPath of an element
function getXPath(element) {
  if (element.id !== "") {
    return 'id("' + element.id + '")';
  }
  if (element === document.body) {
    return '/html/body';
  }

  let ix = 0;
  const siblings = element.parentNode ? element.parentNode.childNodes : [];
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}


// Function to start recording
function startRecording() {
  events = []; // Clear previous events
  document.addEventListener('click', logEvent);
  console.log("zzzzzzz"+events);
}

// Function to stop recording
function stopRecording() {
  document.removeEventListener('click', logEvent);
  // Send the recorded events back to the popup
  chrome.runtime.sendMessage({ action: 'recordingStopped', events });
}

// Function to log events
function logEvent(event) {
  const xpath = getXPath(event.target);
  const eventDetails = {
    type: event.type,
    target: event.target.tagName,
    xpath : xpath,
    x: event.clientX,
    y: event.clientY,
    timestamp: Date.now(),
  };
  events.push(eventDetails);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    startRecording();
    sendResponse({ status: "Recording started." });
  } else if (message.action === 'stopRecording') {
    stopRecording();
    sendResponse({ status: "Recording stopped." });
  } else if (message.action === 'getEvents') {
    sendResponse({ events }); // Send the recorded events
  }
});


});
