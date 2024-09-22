const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
// Enable CORS on the server
const cors = require('cors');
app.use(cors());


app.use(express.json());

app.use(express.static(path.join(__dirname, '/')));


// Serve the upload.html file at the "/upload" route
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'upload.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'demo.html'));
});

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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/recordings/:feature', (req, res) => {
  const featureName = req.params.feature;
  res.sendFile(path.join(__dirname, `/recordings/${featureName}.json`));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

