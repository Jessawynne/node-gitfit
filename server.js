'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extend: false}));

app.locals.appName = 'GITFIT';

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/steps', (req, res) => {
  res.send('all steps');
});

app.get('/steps/input', (req, res) => {
  res.render('steps-input');
});

app.post('/steps/input', (req, res) => {
  res.send('post steps input');
});

app.listen(PORT, () => {
  console.log(`What's up, you're on port: ${PORT}`);
});