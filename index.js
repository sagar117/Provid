const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // For MongoDB connection
require('dotenv').config(); // Load environment variables
const Counter = require('./models/counter.model');


// const config = require('./config/config'); // Configuration file
const { router: authRoutes } = require('./routes/auth'); // Correct import of auth routes
// const { router: orgRoutes } = require('./routes/auth'); // Correct import of auth routes

const orgRoutes = require('./routes/org'); // Import organization routes
const waitlist = require('./routes/waitlist'); // Import organization routes


const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  async function initializeOrgCounter() {
    try {
        const newCounter = new Counter({ _id: 'org', seq: 1 });
        await newCounter.save();
        console.log('Organization counter initialized.');
    } catch (error) {
        console.error('Error initializing counter:', error);
    }
}

initializeOrgCounter();

// Register the authentication routes
app.use('/api/auth', authRoutes); 
// Register the organization routes
app.use('/api/orgs', orgRoutes); 

// Register the waitlist routes
app.use('/api/waitlist', waitlist);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the upload.html file at the "/upload" route
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'upload.html'));
});

// Serve the demo.html file at the "/demo" route
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'demo.html'));
});
app.get('/demo2', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'addappt.html'));
});
app.get('/demo3', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'demo3.html'));
});
app.get('/demo4', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'demo4.html'));
});


// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'login.html'));
});

// Serve the register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'register.html'));
});

// Create org
app.get('/create-org', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'create-org.html'));
});

//Guide Management Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'dashboard.html'));
});


// Upload recorded events
app.post('/upload', (req, res) => {
  const { name, description, events } = req.body;
  const fileName = `${name.replace(/\s+/g, '_')}.json`;

  fs.writeFile(`./recordings/${fileName}`, JSON.stringify({ name, description, events }), (err) => {
    if (err) {
      return res.status(500).send('Error saving file');
    }
    res.send('File uploaded successfully');
  });
});

// Get recorded events by feature name
app.get('/recordings/:feature', (req, res) => {
  const featureName = req.params.feature;
  res.sendFile(path.join(__dirname, `/recordings/${featureName}.json`));
});

// Start the server
app.listen(3000, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3000'));
