var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');
var crypto = require("crypto");
var getPolls = require('./pollInterface/getPolls.js');

module.exports = function(req, res) {
	var username = req.body.usernameLogin;
	var password = req.body.passwordLogin;
	var cookie = req.cookies.sessionCookie;
    console.log("login name: " + username + "; login password: " + password + "; cookie: " + cookie);

	db.serialize(function() {
		console.log("Tried to access login page...");
		db.get("SELECT username FROM Users WHERE sessionCookie = ?;", [ cookie ], (err, row) => {
      		if ((!(row === undefined)) && (!(cookie === null))) { //the brower already has a session cookie: no need to login, just redirect
      			console.log("This username is logged in and tried to access the index page: " + row.username);
      			getPolls(0, res, row.username);
				    //res.render('Poll.ejs', {polls:polls, username:row.username});
      		}
      		else { //the browser has no session cookie: ask him/her to login and set new cookie
      			console.log("no cookie yet: delivering index page...");
      			res.render('index.ejs', {signUpErrorMessage: "", loginErrorMessage: ""});
      		}
  		});
	});
};


