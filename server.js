'use strict';

// app setups

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/gitfit.sqlite');
// var Highcharts = require('highcharts');

const PORT = process.env.PORT || 3000;

// middlewares

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));

app.locals.appName = 'GITFIT';

// routing


//////////// SHOWING CHARTS FOR EASY COMPREHENSION ////////////

app.get('/', (req, res) => {
  // require('highcharts/modules/exporting')(Highcharts);
  // Highcharts.chart('container', {
    // options
  // });
  var pagejs = require('./public/scripts/step-charting');
  // console.log(pagejs);

  // create the actual chart

  const userDataRequest = `
    SELECT * 
    FROM users 
    JOIN stepItems on users.userID = stepitems.userID
    JOIN stepLog on stepItems.steplogID = steplog.id;
  `;

  // interesting: tried to use an .each here but tangled trying to progress from steplogID 21 -> 33
  db.all(userDataRequest, (err, dbRes) => {
    if (err) throw err;
    console.log(dbRes);
    res.send('pagejs<script>console.log("hi hello")</script>');
  })

});

///////// DISPLAYING USER DB TABLES FOR RAW INFO ////////////////

app.get('/steps', (req, res) => {

  // just display the db info on a table

  const userDataRequest = `
    SELECT * 
    FROM users 
    JOIN stepItems on users.userID = stepitems.userID
    JOIN stepLog on stepItems.steplogID = steplog.id;
  `;
  // interesting: tried to use an .each here but tangled trying to progress from steplogID 21 -> 33
  db.all(userDataRequest, (err, dbRes) => {
    if (err) throw err;
    console.log(dbRes);
    res.render('history', {
      context: dbRes
    });
  })


});

app.get('/steps/input', (req, res) => {
  res.render('steps-input');
});

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////// CHAINING SYNCHRONOUSLY THE ADDING OF STEPS ///////////

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
      (${STEP_COUNT_INPUT},'${RIGHT_NOW}', ${userID});
  `;
  const dbGetRecentLog = `
    SELECT * 
    FROM steplog 
    WHERE steplog.userid = ${userID} 
    ORDER BY id 
    DESC;
  `; 

  // Adds new steplog item and stores it in the stepItems join table w/ user info
  db.serialize( () => {

    var currentStepLogId;
    var dbInsertStepLogToStepItems;

    // NESTED DATABASE QUERIES //
    db
      .all(dbInsertStepLog);
    db
      .get(dbGetRecentLog, (err, dbRes) => {
        if (err) throw err;
        console.log('before', dbRes);
        var currentStepLogId = dbRes.id;
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
        // nested, and don't want it that way, but....
        db
          .all(`insert into stepitems (userID, steplogID) values ('${userID}', ${currentStepLogId});`, (err, dbRes) => {
            console.log('plzz', currentStepLogId);
            if (err) throw err;
            console.log('after', dbRes);
            res.redirect('/steps');
          });
      });

    // SERIALIZED DATABASE QUERIES //

    // var stmt = db.prepare(dbInsertStepLog);

    // stmt
    //   .run()
    //   .all(dbGetRecentLog, (err, dbRes) => {
    //     if (err) throw err;
    //     var currentStepLogId = dbRes.id;
    //     var dbInsertStepLogToStepItems = `
    //       INSERT
    //       INTO stepItems 
    //         (userID, steplogID)
    //       VALUES
    //         (${userID}, ${currentStepLogId})
    //     `;
    //   })
    //   .all(dbInsertStepLogToStepItems, (err, dbRes) => {
    //     if (err) throw err;
    //     console.log(currentStepLogId);

    //     console.log(dbRes);
    //     res.redirect('/steps/input');
    //   })


    // }) // closes retrieving of last steplog

    // stmt.all(dbInsertStepLogToStepItems);

    // want the db.all(dbInsert...) to run here

  }); // ends db serialize function



});

// starting server

app.listen(PORT, () => {
  console.log(`Greetings GitFit app, you're on port: ${PORT}`);
});

















