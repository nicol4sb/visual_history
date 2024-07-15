const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the timeline data files
app.get('/data/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'public', 'data', filename));
});

// Route to serve the translation files
app.get('/translations/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'public', 'translations', filename));
});

// Endpoint to list timeline files
app.get('/list-timeline-files', (req, res) => {
    const dataDir = path.join(__dirname, 'public', 'data');
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            res.status(500).send('Error reading timeline data directory');
        } else {
            res.json(files.filter(file => file.startsWith('timeline_data_')));
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
