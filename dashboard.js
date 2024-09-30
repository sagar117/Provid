const apiBaseUrl = 'http://34.71.54.137:3000';  // Update to your backend server
let guides = [];  // Store guides for easy access



// On DOMContentLoaded, fetch the guides for this org
document.addEventListener('DOMContentLoaded', () => {
  fetchGuides();
  
  // Handle guide saving (for new and edited guides)
  document.getElementById('save-guide-btn').addEventListener('click', saveGuide);
});

// Fetch guides from the backend
async function fetchGuides() {
  try {

    // const org_id = localStorage.getItem('token');
    console.log('org_id',org_id);
    const response = await fetch(`${apiBaseUrl}/api/orgs/getGuides/${org_id}`);
    const data = await response.json();
    
    if (response.ok) {
      guides = data;
      populateGuidesTable(guides);
    } else {
      console.error('Error fetching guides:', data.message);
    }
  } catch (error) {
    console.error('Error fetching guides:', error);
  }
}

// Populate the table with guides
function populateGuidesTable(guides) {
  const tbody = document.getElementById('guides-table-body');
  tbody.innerHTML = '';  // Clear previous entries

  guides.forEach(guide => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${guide.title}</td>
      <td>${guide.description}</td>
      <td>${guide.active ? 'Active' : 'Inactive'}</td>
      <td>
        <button class="action-btn" onclick="toggleGuideStatus('${guide.id}', true)">
          <i class="fa fa-check"></i>
        </button>
        <button class="action-btn" onclick="toggleGuideStatus('${guide.id}', false)">
          <i class="fa fa-times"></i>
        </button>
        <button class="action-btn" onclick="deleteGuide('${guide.id}')">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Toggle the guide's active status
async function toggleGuideStatus(guideId, isActive) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/guides/${guideId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ active: isActive })
    });

    if (response.ok) {
      fetchGuides();  // Refresh the table
    } else {
      console.error('Failed to toggle guide status');
    }
  } catch (error) {
    console.error('Error toggling guide status:', error);
  }
}

// Delete a guide
async function deleteGuide(guideId) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/guides/${guideId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchGuides();  // Refresh the table
    } else {
      console.error('Failed to delete guide');
    }
  } catch (error) {
    console.error('Error deleting guide:', error);
  }
}

// Save a guide (create or update)
async function saveGuide() {
  const title = document.getElementById('guide-title').value;
  const description = document.getElementById('guide-description').value;

  if (!title || !description) {
    showFeedback('Please provide both a title and description.', 'error');
    return;
  }

  const newGuide = {
    title,
    description,
    active: true  // Default status is active
  };

  try {
    const response = await fetch(`${apiBaseUrl}/api/guides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGuide)
    });

    if (response.ok) {
      showFeedback('Guide saved successfully!', 'success');
      document.getElementById('guide-title').value = '';
      document.getElementById('guide-description').value = '';
      fetchGuides();  // Refresh the table
    } else {
      console.error('Failed to save guide');
      showFeedback('Error saving guide. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error saving guide:', error);
    showFeedback('Error saving guide. Please try again.', 'error');
  }
}

// Show feedback message
function showFeedback(message, type) {
  const feedbackElement = document.getElementById('guide-feedback');
  feedbackElement.className = `alert ${type}`;
  feedbackElement.textContent = message;
  feedbackElement.style.display = 'block';

  setTimeout(() => {
    feedbackElement.style.display = 'none';
  }, 3000);
}
