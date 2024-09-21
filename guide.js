document.addEventListener('DOMContentLoaded', () => {
  const featureName = document.currentScript.getAttribute('data-feature');
  fetch(`https://your-server.com/recordings/${featureName}.json`)
    .then(response => response.json())
    .then(data => {
      const guideButton = document.createElement('button');
      guideButton.innerText = 'Guide Me';
      guideButton.style.position = 'fixed';
      guideButton.style.bottom = '20px';
      guideButton.style.right = '20px';
      guideButton.addEventListener('click', () => startGuide(data.events));
      document.body.appendChild(guideButton);
    });
});

function startGuide(events) {
  events.forEach(event => {
    setTimeout(() => {
      const target = document.querySelector(event.target);
      const cursor = document.createElement('div');
      cursor.style.position = 'absolute';
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.borderRadius = '50%';
      cursor.style.border = '2px solid red';
      cursor.style.top = `${event.y}px`;
      cursor.style.left = `${event.x}px`;
      document.body.appendChild(cursor);

      setTimeout(() => cursor.remove(), 1000);
    }, event.timestamp - events[0].timestamp);
  });
}

