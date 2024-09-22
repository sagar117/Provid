document.addEventListener('DOMContentLoaded', () => {
  // Use document.getElementById to access the script and get the data-feature attribute
  const featureScript = document.getElementById('guide-script');
  const featureName = featureScript.getAttribute('data-feature');  // Safely access the data attribute

  // Fetch the recorded JSON data from your server based on the feature name
 fetch(`http://localhost:3000/recordings/example-feature`)
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
  // let startTime = Date.now();
  console.log("cvcvcv");
  if (!events || events.length === 0) {
    console.error('No events found to guide the user.');
    return;
  }

  let startTime = Date.now();
  console.log("Starting guide with events:", events);

  // Pass events to guideUserThroughSteps
  guideUserThroughSteps(events);
  
  // Iterate over each event and simulate the interaction
  events.forEach((event, index) => {
    setTimeout(() => {
      const targetElement = document.querySelector(event.target);

      if (targetElement) {
        highlightElement(targetElement, event.x, event.y);
      } else {
        console.warn(`Target element not found for event at: ${event.target}`);
      }

      if (index === events.length - 1) {
        console.log('Guide finished.');
      }
    }, event.timestamp - events[0].timestamp);
  });
}

function guideUserThroughSteps(events) {
  console.log(events);
  events.forEach((event, index) => {
    setTimeout(() => {
      const target = document.querySelector(event.target);
      if (target) {
        const cursor = document.createElement('div');
        cursor.style.position = 'absolute';
        cursor.style.width = '5px';
        cursor.style.height = '5px';
        cursor.style.borderRadius = '20%';
        cursor.style.border = '2px solid red';
        cursor.style.top = `${event.y}px`;
        cursor.style.left = `${event.x}px`;
        document.body.appendChild(cursor);

        setTimeout(() => cursor.remove(), 1000);
      }
    }, event.timestamp - events[0].timestamp);
  });
} 

// Function to highlight the element where the interaction happened
function highlightElement(element, x, y) {
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

  // Optionally highlight the actual element (like a button)
  element.style.outline = '2px solid blue';

  // Remove the highlight after 1.5 seconds
  setTimeout(() => {
    cursor.remove();
    element.style.outline = '';  // Remove outline from the element
  }, 1500);
}
