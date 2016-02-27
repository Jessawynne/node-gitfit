'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/gitfit.sqlite');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));

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

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/steps/input', (req, res) => {
  // collects user information from page input
  const STEP_COUNT_INPUT = getRandomIntInclusive(500, 2000);
  console.log(`# of steps is ${STEP_COUNT_INPUT}`);
  const RIGHT_NOW = new Date().toISOString();
  // steplog values(steplogID, stepCount, stepDate, userID)
  const userID = 1;
  const dbInsertStepLog = `
    INSERT 
    INTO steplog 
      (stepCount, stepDate, userID) 
    VALUES
      (${STEP_COUNT_INPUT},'${RIGHT_NOW}', ${userID})
  `;
  const dbGetRecentStepLog = `
    SELECT * 
    FROM steplog 
    WHERE steplog.userid = ${userID} 
    ORDER BY id 
    DESC
  `;
  // Adds new steplog item and stores it in the stepItems join table w/ user info
  db.serialize( () => {

    db.all(dbInsertStepLog, (err,dbres) => {
      if (err) throw err;

      console.log('resp from insert', dbres);
      console.log('steps input from browser', req.body);
    })
    var currentStepLogId;
    var dbInsertStepLogToStepItems;

    // returns most recent steplog, aka the one inserted just above
    db.get(dbGetRecentStepLog, (err, dbRes) => {
      if (err) throw err;

      console.log('resp from get', dbRes);
      currentStepLogId = dbRes.id;
      console.log(`currentStepLogId is ${currentStepLogId}`);

      // retrieves information so that we can insert aproprors to join table
      dbInsertStepLogToStepItems = `
        INSERT
        INTO stepItems 
          (userID, steplogID)
        VALUES
          (${userID}, ${currentStepLogId})
      `;
      console.log(`command is ${dbInsertStepLogToStepItems}`);

    })
    // inserts userID and steplogID to join table
    // db.all(dbInsertStepLogToStepItems, (err, dbRes) => {
    //   if (err) throw err;
    //   console.log('resp from last insert', dbRes);
      res.redirect('/steps/input');
    // });
    // db.all(dbInsertStepLogToStepItems);
  });
    // insert to user table


});

app.listen(PORT, () => {
  console.log(`What's up, you're on port: ${PORT}`);
});

















