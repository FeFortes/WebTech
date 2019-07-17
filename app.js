var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var logInPageHandle = require('./DO/loginPage.js');
var logInSubmittedHandle = require('./DO/login.js');
var signUpSubmittedHandle = require('./DO/signUp.js');
var logOutSubmittedHandle = require('./DO/logOut.js');
var newPollSubmittedHandle = require('./DO/newPoll.js');
var voteSubmittedHandle = require('./DO/voteSubmitted.js');
var morePollsHandle = require('./DO/morePolls.js');

var app = express();

app.use(express.urlencoded({ extended: true  }));
app.use(cookieParser());
//new line below:
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get(['/', 'index.html'], function(req, res) { //TO DO: CALL THE HANDLER, WHICH CHECKS IF THE USER HAS COOKIE
	logInPageHandle(req, res);   
    //res.render('index.ejs', {signUpErrorMessage: "", loginErrorMessage: ""}); //other option: "The Username chosen already exists"
}); //The password that you've entered is incorrect.


//TODO: IF THE PERSON TRIES TO ACCESS THE POLLS PAGE, REDIRECT IF HE IS NOT LOGGED IN; SHOW IT IF HE IS
//DELETE THE COLUMN FLAG LOGGED IN, AS THE EXISTANCE OF COOKIE HAS THE SAMEE MEANING
app.post('/submit-login', (req, res) => { //Submitted LOGIN
  //const username = req.body.username
  console.log("entered login!");
  logInSubmittedHandle(req, res);
})

app.post('/submit-signUp', (req, res) => { //Submitted SIGNUP
  //const username = req.body.username
  console.log("entered signUp!");
  signUpSubmittedHandle(req, res);
}) 

app.post('/submit-logout', (req, res) => { //Submitted LOGOUT
  console.log("logging out!");
  logOutSubmittedHandle(req, res);
})


app.post('/submit-new-poll', (req, res) => { //Submitted NEW POLL
  console.log("new poll being Submitted!");
  newPollSubmittedHandle(req, res);
})

app.post('/submit-vote', (req, res) => { //Submitted NEW POLL
  console.log("voted poll id: " + req.body.pollId + " vote: " + req.body.vote);
  voteSubmittedHandle(req, res);
})

app.post('/ask-more-polls', (req, res) => { //asked for MORE POLLS
  console.log("polls so far: " + req.body.numPollsSoFar);
  morePollsHandle(req, res);
})
//module.exports = app;
app.listen(8080, "localhost");