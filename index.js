const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the timeline data
app.get('/timeline_data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'timeline_data.json'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
