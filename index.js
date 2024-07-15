const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list all timeline files
app.get('/list-timeline-files', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).json({ error: 'Failed to read directory' });
      return;
    }
    const timelineFiles = files.filter(file => file.startsWith('timeline_data_') && file.endsWith('.json'));
    res.json(timelineFiles);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
