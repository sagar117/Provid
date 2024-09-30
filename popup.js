const apiBaseUrl = 'http://34.71.54.137:3000';  // Replace with your actual server IP

  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authSection = document.getElementById('auth-section');
  const recorderSection = document.getElementById('recorder-section');
  const logoutBtn = document.getElementById('logout-btn');

// Function to update button states based on recording status
function updateButtonStates(isRecording) {
  const startButton = document.getElementById('start-recording');
  const stopButton = document.getElementById('stop-recording');
// const startBtn = document.getElementById('start-recording');
// const stopBtn = document.getElementById('stop-recording');
// const loadBtn = document.getElementById('load-recording');
// const recordedInfoDisplay = document.getElementById('recorded-info');
// const recordInfoSection = document.getElementById('record-info');
// const featureNameInput = document.getElementById('feature-name');
// const featureDescriptionInput = document.getElementById('feature-description');
// const saveRecordingBtn = document.getElementById('save-recording');
// const uploadBtn = document.getElementById('upload-btn');
// const loginError = document.getElementById('login-error');
// const signupError = document.getElementById('signup-error');

  startButton.disabled = isRecording;
  stopButton.disabled = !isRecording;
}

// Check if user is logged in
const authToken = localStorage.getItem('token');
if (authToken) {
  showRecorderSection();  // User is logged in, show the recorder section
} else {
  showLoginForm();  // Show login/signup forms if not logged in
}

// Switch between login and signup forms
document.getElementById('switch-to-signup').addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

document.getElementById('switch-to-login').addEventListener('click', () => {
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Handle Login
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    loginError.textContent = 'Please fill in both fields';
    return;
  }


  const payload = { username, password };

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Response status:", response.status); // Log response status
    console.log("Response data:", data); // Log response data for debugging

    if (response.ok) {
        // Login was successful
        alert('Login successful!');
        // Save token in localStorage or session storage
        localStorage.setItem('token', data.token);
        const authToken = data.token;
        chrome.storage.local.set({ authToken: authToken }, function() {
          console.log('Auth token is saved.');
        });
        sessionStorage.setItem('refreshToken', data.refreshToken);
        org_name = data.user.id
        showRecorderSection();
        Getorgdetails(org_name);

        // Redirect user to dashboard or homepage
        // window.location.href = '/dashboard.html';
    } else {
        // Handle login failure
        alert(data.message || 'Login failed');
    }
} catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred while trying to log in. Please try again.');
}
});

// Handle Signup
document.getElementById('signup-btn').addEventListener('click', async () => {
  const orgName = document.getElementById('signup-org').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (!orgName || !email || !password) {
    signupError.textContent = 'Please fill in all fields';
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/orgs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgName, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);  // Store the token in localStorage
      showRecorderSection();
    } else {
      const errorData = await response.json();
      signupError.textContent = errorData.message || 'Signup failed';
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  location.reload();  // Reload the extension to reset state
});

// Function to show the recorder section after login/signup
function showRecorderSection() {
  authSection.style.display = 'none';
  recorderSection.style.display = 'block';
}

async function Getorgdetails(orgname){
  try {
    const response = await fetch(`${apiBaseUrl}/api/orgs//organization/${orgname}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Response status:", response.status); // Log response status
    console.log("Response data:", data); // Log response data for debugging

    if (response.ok) {
        // org was successful
        alert('Org fetched');
    
        const org_id = data.org_id;
        chrome.storage.local.set({ org_id: org_id }, function() {
          console.log('Auth token is saved.');
        });

    } else {
        // Handle org failure
        alert(data.message || 'Org get failed');
    }
} catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred while trying to log in. Please try again.');
}


}

// Function to show the login form
function showLoginForm() {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  recorderSection.style.display = 'none';
}




// Check the current recording state from Chrome storage
chrome.storage.sync.get(['isRecording'], (result) => {
  const isRecording = result.isRecording || false;
  updateButtonStates(isRecording);
});

// Start recording
document.getElementById('start-recording').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== -1) {
      const tabId = tabs[0].id;

      // Send a message to the content script to start recording
      chrome.tabs.sendMessage(tabId, { action: 'startRecording' });

      // Update the recording state
      chrome.storage.sync.set({ isRecording: true });
      updateButtonStates(true);
    } else {
      console.error("No active tab found or invalid tab ID.");
    }
  });
});

// Stop recording
document.getElementById('stop-recording').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== -1) {
      const tabId = tabs[0].id;

      // Send a message to the content script to stop recording
      chrome.tabs.sendMessage(tabId, { action: 'stopRecording' });

      // Update the recording state
      chrome.storage.sync.set({ isRecording: false });
      updateButtonStates(false);

      // Display the save recording form
      document.getElementById('record-info').style.display = 'block';

        // Listen for the response with events
        chrome.runtime.onMessage.addListener((message) => {
          if (message.action === "recordingStopped") {
            const events = message.events || [];
            // Now you can handle the events, e.g., save them
            console.log("Received events:", events);
          }else{
            console.log("Didn't Received events:", events);

            
          }
        });
        

          console.log('Recording stopped on tab ID:', tabId);
        } else {
          console.error("No active tab found or invalid tab ID.");
        }
      });
    });

  // Save the recorded events
  document.getElementById('save-recording').addEventListener('click', () => {
    const name = document.getElementById('feature-name').value;
    const description = document.getElementById('feature-description').value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== -1) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: 'getEvents' }, (response) => {
          console.log("vvvvvvvagh", response);
          if (response && response.events) {
            const events = response.events || [];
            const recordingData = {
              name,
              description,
              events
            };

            // Save the recording data to the background script
            chrome.runtime.sendMessage({ action: 'saveRecording', data: recordingData }, (response) => {
              console.log(response.status);
              alert(response.status); // Alert the user about the status
            });
          } else {
            console.error("No events recorded or response is invalid.");
          }
        });
      } else {
        console.error("No active tab found or invalid tab ID.");
      }
    });
  });

  // Listen for the response with events
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "recordingStopped") {
    const events = message.events || [];
    console.log("Received events:", events);
    // You can add additional handling for events here if needed
  }
});


  // Load saved recordings
  document.getElementById('load-recording').addEventListener('click', () => {
    chrome.storage.local.get(['recordingData'], (result) => {
      if (result.recordingData) {
        const recordingData = result.recordingData;
        console.log("Retrieved recording data:", recordingData);
        document.getElementById('recorded-info').textContent = JSON.stringify(recordingData, null, 2);
      } else {
        console.log("No recording data found.");
        document.getElementById('recorded-info').textContent = "No recording data found.";
      }
    });

    document.getElementById('upload-btn').addEventListener('click', () => {
      // Open a new tab to the upload.html page
      chrome.tabs.create({
        url: chrome.runtime.getURL('upload.html')
      });
    });
    
  });
