const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // For MongoDB connection
const authRoutes = require('./routes/auth'); // Import authentication routes
const guideRoutes = require('./routes/dashoard'); // Import guide management routes

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Use authentication and guide routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', guideRoutes);

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
