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

    // IF THE USER HAS A COOKIE SET UP (LOGGED IN), REDIRECT TO THE POLLS PAGE OF THE USER


	db.serialize(function() {
		db.get("SELECT username FROM Users WHERE sessionCookie = ?;", [ cookie ], (err, row) => {
      		if ((!(row === undefined)) && (!(cookie === null))) { //the brower already has a session cookie: no need to login, just redirect
      			console.log(row.username);
      			getPolls(0, res, row.username);
				//res.render('Poll.ejs', {polls:polls, username:row.username});
      		}
      		else { //the browser has no session cookie: ask him/her to login and set new cookie
      			console.log("no cookie yet");
      			db.each("SELECT Count(username) as access FROM Users WHERE username=? AND password=?;", [ username, password ], (err, row) => {
		 			if (err) {
		  	 			throw err;
		 			}

		 	 		console.log("Flag found user: " + row.access);
		 	 		if(!row.access) { //did not find existing user
		 	 			res.render('index.ejs', {signUpErrorMessage: "", loginErrorMessage: "The password that you've entered is incorrect."});  
		        		return;
		 	 		}
		 	 		else { //found user! Do login!
		 	 			console.log("loging in");
					    var r = crypto.randomBytes(20).toString('hex');
					    res.cookie('sessionCookie', r); //TODO: UPDATE COOKIE IN THE DATABASES
					    db.each("UPDATE Users SET flagLoggedIn = True, sessionCookie = ? WHERE username=?;", [ r, username ], (err, row) => {
				 			if (err) {
				  	 		throw err;
				 			}	
						});

						getPolls(0, res, username);
						//console.log("rendering...");
					    //res.render('Poll.ejs', {polls:polls, username:username});

		 	 		}
 	 		
				});
      		}
  		});
	});
};


