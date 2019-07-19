var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');
var getPolls = require('./pollInterface/getPolls.js');

module.exports = function(req, res) {
	var cookie = req.cookies.sessionCookie;
	var newPoll = req.body.newPoll;
    console.log("New poll cookie: " + cookie + " poll: " + newPoll);
  	


    db.serialize(function() {
		db.get("SELECT username FROM Users WHERE sessionCookie = ?;", [ cookie ], (err, row) => {
      		if ((!(row === undefined)) && (!(cookie === null))) { //the browser already has a session cookie: no need to login, just redirect
      			var username = row.username;
            console.log("user submitting poll: " + username);
      			
    				var date = new Date().toLocaleString(); 
    		  		db.run("INSERT INTO Polls (author, date_of_creation, num_yes, num_no, poll_text) VALUES (?, ?, ?, ?, ?);", [ username, date, 0, 0, newPoll ], (err, row) => {
    		 			if (err) {
    		  	 		throw err;
    		 			}	
    		 			console.log("new poll inserted!");
    		 			getPolls(0, res, username);
    					//res.render('Poll.ejs', {polls:polls, username:username});
    				});
  				
      		}
      		else { //no cookie found
            console.log("did not found user with the cookie " + cookie);
      			res.render('index.ejs', {signUpErrorMessage: "", loginErrorMessage: ""});
      		}
  		});
	});


};