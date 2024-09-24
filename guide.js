document.addEventListener('DOMContentLoaded', () => {
  // Access the script element and get the data-feature attribute
  const featureScript = document.getElementById('guide-script');
  const featureName = featureScript.getAttribute('data-feature');  // Safely access the data attribute

  // Fetch the recorded JSON data from your server based on the feature name
  fetch(`http://0.0.0.0:3000/recordings/${featureName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load feature guide: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data);  // Log the fetched data

      if (!data || !data.events || !Array.isArray(data.events)) {
        console.error('Invalid data format or no events found:', data);
        return;
      }

      const guideButton = document.createElement('button');
      guideButton.innerText = 'Guide Me';
      guideButton.style.position = 'fixed';
      guideButton.style.bottom = '20px';
      guideButton.style.right = '20px';
      guideButton.style.zIndex = '9999';

      guideButton.addEventListener('click', () => {
        console.log('Guide button clicked, starting guide with events:', data.events);
        startGuide(data.events);
      });

      document.body.appendChild(guideButton);
    })
    .catch(error => {
      console.error('Error fetching the feature guide:', error);
    });
});

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
      // Locate the target element using XPath instead of a simple querySelector
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
