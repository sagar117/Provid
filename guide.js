const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP
let guideDataArray = [];  // Global array to store fetched guides

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
        option.value = guide.name;  // Assuming `name` is unique
        option.textContent = guide.name;
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
  return guideDataArray.find(guide => guide.name === selectedGuide);  // Adjust as necessary
}

function startGuide(events) {
  if (!events || events.length === 0) {
    console.error('No events found to guide the user.');
    return;
  }

  console.log("Starting guide with events:", events);
  guideUserThroughSteps(events);
}

function guideUserThroughSteps(events) {
  console.log(events);
  events.forEach((event, index) => {
    setTimeout(() => {
      // Locate the target element using XPath
      const target = getElementByXpath(event.xpath);
      if (target) {
        // Create a cursor with accompanying text from the events array
        highlightElement(target, event.x, event.y, event.text || `Step ${index + 1}`);
      } else {
        console.warn(`Target element not found for event at: ${event.xpath}`);
      }
    }, event.timestamp - events[0].timestamp);
  });
}

// Function to highlight the element where the interaction happened
function highlightElement(element, x, y, text) {
  // Create a visual cursor or highlight effect
  const cursor = document.createElement('div');
  cursor.style.position = 'absolute';
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.borderRadius = '50%';
  cursor.style.border = '2px solid red';
  cursor.style.top = `${y}px`;
  cursor.style.left = `${x}px`;
  cursor.style.zIndex = '9999';

  document.body.appendChild(cursor);

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
  guideText.style.left = `${x + 50}px`; // Text displayed 30px to the right of the cursor

  guideText.textContent = text || 'Step';

  document.body.appendChild(guideText);

  // Highlight the actual element (like a button or input field)
  element.style.outline = '2px solid blue';

  // Remove the highlight and text after 1.5 seconds
  setTimeout(() => {
    cursor.remove();
    guideText.remove();
    element.style.outline = '';  // Remove outline from the element
  }, 2000);
}

// Helper function to get an element by XPath
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
