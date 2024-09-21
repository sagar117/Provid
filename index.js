const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

