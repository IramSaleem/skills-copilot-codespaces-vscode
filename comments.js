// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

// Create a port
const PORT = 3000;

// Create a database
const comments = require('./comments.json');

// Create a path to the json file
const jsonPath = path.join(__dirname, 'comments.json');

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a path for the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create a path for the comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Create a path for posting comments
app.post('/comments', (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).send('You must include a name and comment');
  }

  const newComment = {
    name,
    comment,
    date: moment().format('MMMM Do YYYY, h:mm:ss a')
  };

  comments.push(newComment);

  const jsonComments = JSON.stringify(comments, null, 2);

  fs.writeFile(jsonPath, jsonComments, 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error saving comment');
    }
    res.json(newComment);
  });
});

// Create a port to listen to
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});