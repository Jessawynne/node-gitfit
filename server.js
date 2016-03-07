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
  const YO_RANDOM_NUMBER = 4; // uuid.v1();
  const RIGHT_NOW = '2016-02-26';
  // steplog values(steplogID, stepCount, stepDate, userID)
  const dbInsertStepLog = `
    Insert into steplog (stepCount, stepDate, userID) Values(750,'${RIGHT_NOW}', 1)
  `;
 
  const dbInsertUser = `
    insert into users values (1, ${YO_RANDOM_NUMBER}, 'JANE', 'DOE')
  `;
  console.log(`yr dbInsertStepLog is ${dbInsertStepLog}`);
  // db.serialize(
    db.all(dbInsertStepLog, (err,dbres) => {
      if (err) throw err;

      console.log('resp from db', dbres);
      console.log('steps input from browser', req.body);
      res.redirect('/steps/input');
    })
    // insert to user table


  // );
});

app.listen(PORT, () => {
  console.log(`What's up, you're on port: ${PORT}`);
});

















