var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');
var crypto = require("crypto");
var getPolls = require('./pollInterface/getPolls.js');

module.exports = function(req, res) {
	var cookie = req.cookies.sessionCookie;
    console.log("cookie logging out: " + cookie);
  	
  	//TODO: SET COOKIE SESSION TO NULL IN THE DATABASE AND IN THE BROWSER AND FLAG LOGGED IN TO 0
  	//REDIRECT TO LOGIN PAGE
	db.serialize(function() {
  		db.each("UPDATE Users SET flagLoggedIn = False, sessionCookie = NULL WHERE sessionCookie=?;", [ cookie ], (err, row) => {
 			if (err) {
  	 		throw err;
 			}	
		});
	}); //QUESTION: I THINK I SHOULD PUT THE 2 LINES BELOW AFTER THE IF ERR, TO FORCE SEQ EXECUTION


	res.cookie('sessionCookie', null);
	res.render('index.ejs', {signUpErrorMessage: "", loginErrorMessage: ""});
};