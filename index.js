const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // For MongoDB connection
require('dotenv').config(); // Load environment variables

// const config = require('./config/config'); // Configuration file
const { router: authRoutes, authenticateJWT } = require('./routes/auth'); // Correct import of auth routes
const orgRoutes = require('./routes/org'); // Import organization routes

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register the authentication routes
app.use('/api/auth', authRoutes); 
// Register the organization routes
app.use('/api/orgs', orgRoutes); 

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

// Serve the login page
app.get('/login', authenticateJWT,(req, res) => {
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

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  // Check if a refresh token is provided
  if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // (Optional) Check if the refresh token matches the one stored in the database
      const dbUser = await User.findOne({ username: user.username });
      if (dbUser.refreshToken !== refreshToken) {
          return res.status(403).json({ message: 'Refresh token does not match' });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.json({
          accessToken: newAccessToken
      });
  });
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
