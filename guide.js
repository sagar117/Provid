const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP
let guideDataArray = [];  // Global array to store fetched guides
let currentEventIndex = 0; // Track the current event index
let isGuideActive = false; // Flag to check if the guide is active

document.addEventListener('DOMContentLoaded', () => {
  // Create and append the dropdown for selecting guides
  const dropdown = document.createElement('select');
  dropdown.id = 'guide-dropdown';
  dropdown.innerHTML = '<option value="">Select a guide...</option>';
  document.body.appendChild(dropdown);

  // Create and append the "Guide Me" button
  const guideButton = document.createElement('button');
  guideButton.innerText = 'Guide Me';
  guideButton.style.position = 'fixed';
  guideButton.style.bottom = '20px';
  guideButton.style.right = '20px';
  guideButton.style.zIndex = '9999';
  guideButton.disabled = true;  // Disable until a guide is selected
  document.body.appendChild(guideButton);

  // Fetch the guides when the script loads
  fetchGuides(dropdown, guideButton);

  // Event listener for the guide button
  guideButton.addEventListener('click', () => {
    const selectedGuide = dropdown.value;
    if (!selectedGuide) {
      alert('Please select a guide from the dropdown to start the guide.');
      return;
    }

    const guideData = getGuideData(selectedGuide);  // Get data for the selected guide
    if (guideData) {
      startGuide(guideData.events);
    } else {
      console.error('Guide data not found for:', selectedGuide);
    }
  });
});

// Fetch the guides and populate the dropdown
async function fetchGuides(dropdown, guideButton) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/orgs/getGuides`);
    const guides = await response.json();

    if (response.ok) {
      guideDataArray = guides;  // Store fetched guides in the global array
      guides.forEach(guide => {
        const option = document.createElement('option');
        option.value = guide.title;  // Assuming `name` is unique
        option.textContent = guide.title;
        dropdown.appendChild(option);
      });

      dropdown.addEventListener('change', function() {
        guideButton.disabled = dropdown.value === '';  // Enable button if a guide is selected
      });
    } else {
      console.error('Failed to fetch guides:', guides.message);
    }
  } catch (error) {
    console.error('Error fetching guides:', error);
  }
}

// Function to get guide data based on the selected guide name
function getGuideData(selectedGuide) {
  return guideDataArray.find(guide => guide.title === selectedGuide);  // Adjust as necessary
}

function startGuide(events) {
  if (!events || events.length === 0) {
    console.error('No events found to guide the user.');
    return;
  }

  currentEventIndex = 0; // Reset event index to start from the beginning
  isGuideActive = true; // Set the guide as active
  guideUserThroughSteps(events); // Start guiding
}

function guideUserThroughSteps(events) {
  if (currentEventIndex >= events.length) {
    console.log('All guide events completed.');
    isGuideActive = false; // Mark guide as inactive
    return; // Exit if all events have been shown
  }

  const event = events[currentEventIndex]; // Get the current event
  const target = getElementByXpath(event.xpath); // Locate the target element

  if (target) {
    highlightElement(target, event.x, event.y, event.text || `Step ${currentEventIndex + 1}`);

    // Check for modal popup or new page navigation
    if (isModalOpen()) {
      console.log('Modal is open, pausing guide.');
      waitForModalClose().then(() => {
        console.log('Modal closed, resuming guide.');
        currentEventIndex++; // Move to the next event
        guideUserThroughSteps(events); // Resume guiding
      });
    } else {
      // Move to the next step after a delay
      setTimeout(() => {
        currentEventIndex++; // Increment event index
        guideUserThroughSteps(events); // Continue to the next step
      }, 2000); // Adjust delay as needed
    }
  } else {
    console.warn(`Target element not found for event at: ${event.xpath}`);
  }
}

// Function to highlight the element where the interaction happened
function highlightElement(element, x, y, text) {
  // Create a visual cursor with concentric circles
  const cursor = document.createElement('div');
  cursor.style.position = 'absolute';
  cursor.style.width = '40px';
  cursor.style.height = '40px';
  cursor.style.borderRadius = '50%';
  cursor.style.top = `${y - 20}px`;  // Centered on the element
  cursor.style.left = `${x - 20}px`;
  cursor.style.zIndex = '9999';
  cursor.style.border = '2px solid rgba(0, 150, 255, 0.75)';  // Outer circle
  cursor.classList.add('wave-cursor');

  document.body.appendChild(cursor);

  // CSS animation for the wave effect
  const style = document.createElement('style');
  style.innerHTML = `
    .wave-cursor {
      animation: waveAnimation 1.5s infinite ease-in-out;
    }

    @keyframes waveAnimation {
      0% {
        transform: scale(0.9);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.5;
      }
      100% {
        transform: scale(0.9);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Create a text box to show next to the cursor
  const guideText = document.createElement('div');
  guideText.style.position = 'absolute';
  guideText.style.color = 'white';
  guideText.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  guideText.style.padding = '5px 10px';
  guideText.style.borderRadius = '5px';
  guideText.style.fontSize = '14px';
  guideText.style.zIndex = '9999';
  guideText.style.top = `${y}px`;
  guideText.style.left = `${x + 50}px`; // Text displayed 50px to the right of the cursor

  guideText.textContent = text || 'Step';

  document.body.appendChild(guideText);

  // Highlight the actual element (like a button or input field)
  element.style.outline = '2px solid blue';

  // Remove the highlight and text after 2 seconds
  setTimeout(() => {
    cursor.remove();
    guideText.remove();
    element.style.outline = '';  // Remove outline from the element
  }, 2000);
}

// Function to check if a modal is open
function isModalOpen() {
  return !!document.querySelector('.modal.show'); // Adjust selector based on your modal implementation
}

// Function to wait for a modal to close
function waitForModalClose() {
  return new Promise((resolve) => {
    const checkModal = setInterval(() => {
      if (!isModalOpen()) {
        clearInterval(checkModal);
        resolve();
      }
    }, 500); // Check every 500ms
  });
}

// Helper function to get an element by XPath
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
