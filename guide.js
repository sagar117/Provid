const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

let guidesData = [];  // To store all guide data with events
let selectedGuideEvents = [];  // To store events of the selected guide

document.addEventListener('DOMContentLoaded', () => {
  const featureScript = document.getElementById('guide-script');
  const featureName = featureScript?.getAttribute('data-feature');  // Safely access the data attribute

  // Create and configure the 'Guide Me' button
  const guideButton = document.createElement('button');
  guideButton.innerText = 'Guide Me';
  guideButton.style.position = 'fixed';
  guideButton.style.bottom = '20px';
  guideButton.style.right = '20px';
  guideButton.style.zIndex = '9999';

  guideButton.addEventListener('click', () => {
    if (selectedGuideEvents.length > 0) {
      console.log('Starting guide with selected events:', selectedGuideEvents);
      startGuide(selectedGuideEvents);
    } else {
      alert('Please select a guide from the dropdown to start the guide.');
    }
  });

  document.body.appendChild(guideButton);

  // Fetching guide list and setting data-feature
  const fetchGuidesButton = document.getElementById('fetch-guides');
  
  if (fetchGuidesButton) {
    fetchGuidesButton.addEventListener('click', async function() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/orgs/getGuides`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const guides = await response.json();

        if (response.ok) {
          // Store the fetched guide data
          guidesData = guides;
          console.log('Fetched guide data:', guidesData);

          // Populate the dropdown with guide names
          const dropdown = document.getElementById('guide-dropdown');
          if (dropdown) {
            dropdown.innerHTML = '<option value="">Select a guide...</option>'; // Clear existing options
            guides.forEach(guide => {
              const option = document.createElement('option');
              option.value = guide.name;
              option.textContent = guide.name;
              dropdown.appendChild(option);
            });

            // Set data-feature when a guide is selected and get its events
            dropdown.addEventListener('change', function() {
              const selectedGuideName = dropdown.value;
              if (selectedGuideName) {
                const guideScript = document.getElementById('guide-script');
                guideScript.setAttribute('data-feature', selectedGuideName);
                alert(`Guide selected: ${selectedGuideName}`);
                
                // Get the events for the selected guide from the already fetched data
                const selectedGuide = guidesData.find(guide => guide.name === selectedGuideName);
                if (selectedGuide && selectedGuide.events) {
                  selectedGuideEvents = selectedGuide.events;
                  console.log(`Events for ${selectedGuideName} set:`, selectedGuideEvents);
                } else {
                  console.error(`No events found for the selected guide: ${selectedGuideName}`);
                  selectedGuideEvents = [];
                }
              }
            });
          } else {
            console.error("Dropdown element not found!");
          }
        } else {
          console.error('Failed to fetch guides:', guides.message);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    });
  }
});

// Function to start the guide based on selected events
function startGuide(events) {
  if (!events || events.length === 0) {
    console.error('No events found to guide the user.');
    return;
  }

  console.log("Starting guide with events:", events);
  guideUserThroughSteps(events);
}

// Function to guide the user through the steps
function guideUserThroughSteps(events) {
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

  const guideText = document.createElement('div');
  guideText.style.position = 'absolute';
  guideText.style.color = 'white';
  guideText.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  guideText.style.padding = '5px 10px';
  guideText.style.borderRadius = '5px';
  guideText.style.fontSize = '14px';
  guideText.style.zIndex = '9999';
  guideText.style.top = `${y}px`;
  guideText.style.left = `${x + 50}px`; // Display text next to cursor

  guideText.textContent = text || 'Step';

  document.body.appendChild(guideText);

  element.style.outline = '2px solid blue';  // Highlight the element

  setTimeout(() => {
    cursor.remove();
    guideText.remove();
    element.style.outline = '';  // Remove outline after 2 seconds
  }, 2000);
}

// Helper function to get an element by XPath
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
