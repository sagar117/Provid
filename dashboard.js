document.addEventListener('DOMContentLoaded', function() {
    const guidesTableBody = document.getElementById('guides-table-body');
  
    // Function to fetch guides from the API
    async function fetchGuides() {
      try {
        const response = await fetch('/api/guides');  // Adjust the endpoint as per your API
        const guides = await response.json();
  
        populateGuidesTable(guides);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    }
  
    // Function to populate guides into the table
    function populateGuidesTable(guides) {
      guidesTableBody.innerHTML = '';  // Clear existing table body
  
      guides.forEach(guide => {
        const row = document.createElement('tr');
  
        const titleCell = document.createElement('td');
        titleCell.textContent = guide.title;
        row.appendChild(titleCell);
  
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = guide.description;
        row.appendChild(descriptionCell);
  
        const actionsCell = document.createElement('td');
  
        // Button to generate product document using OpenAI
        const generateDocButton = document.createElement('button');
        generateDocButton.textContent = 'Generate Product Doc';
        generateDocButton.className = 'action-btn';
        generateDocButton.addEventListener('click', function() {
          generateProductDoc(guide._id);
        });
        actionsCell.appendChild(generateDocButton);
  
        row.appendChild(actionsCell);
        guidesTableBody.appendChild(row);
      });
    }
  
    // Function to call OpenAI API to generate product document
    async function generateProductDoc(guideId) {
      try {
        const prompt = `Create a product document for guide ID ${guideId}.`;  // Adjust prompt as needed
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
  
        const result = await response.json();
        displayGeneratedDoc(result);  // Function to show the generated document
      } catch (error) {
        console.error('Error generating product document:', error);
      }
    }
  
    // Function to display the generated document (you can customize this to show it in the UI)
    function displayGeneratedDoc(doc) {
      alert('Product document generated: ' + doc.content);  // Placeholder alert, can be styled or shown differently
    }
  
    // Fetch guides on page load
    fetchGuides();
  });
  