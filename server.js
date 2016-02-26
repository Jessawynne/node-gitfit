'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');


const db = new sqlite3.Database('./db/gitfit.sqlite');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extend: false}));

app.locals.appName = 'GITFIT';

app.get('/', (req, res) => {
  db.all(`SELECT * from users`, (err, dbres) => {
    if (err) throw err;
    console.log(dbres);
    res.render('index');
  })
});

app.get('/steps', (req, res) => {
  res.send('all steps');
});

app.get('/steps/input', (req, res) => {
  res.render('steps-input');
});

app.post('/steps/input', (req, res) => {
  db.all(`Insert into steplog Values(3,750,'2016-01-01', 1)`, (err,dbres) => {
    console.log(dbres);
  console.log('steps input', req.body);
  res.send('post steps input');
  });
});

app.listen(PORT, () => {
  console.log(`What's up, you're on port: ${PORT}`);
});
