var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');
var crypto = require("crypto");
var getPolls = require('./pollInterface/getPolls.js');

module.exports = function(req, res) {
	var username = req.body.usernameSignUp;
	var password = req.body.passwordSignUp;
  var email    = req.body.emailSignUp;
  console.log("SignUp username: " + username + "; SignUp password: " + password + "; SignUp email: ", email);

  //checking if the username already exist
  db.serialize(function() {
    db.each("SELECT Count(username) as access FROM Users WHERE username=?", [ username ], (err, row) => {
      if (err) {
        throw err;
      }
      var flagUsernameExists = row.access;
      console.log("Flag username exists: " + flagUsernameExists);

      //if the username does not exist, create a new account and deliver the page. 
      //if it already exist, return an error message
      if(!flagUsernameExists) { //username does not exist
        var r = crypto.randomBytes(20).toString('hex');
        res.cookie('sessionCookie', r); //set sessionCookie to the browser (logging in with the now account)

        db.run("INSERT INTO Users VALUES (?, ?, ?, True, ?)", [ username, password, email, r ], (err, row) => {
          if (err) {
            throw err;
          } 
          console.log("New user created, logging in...");
          //log in with the new account
          getPolls(0, res, username);
          //res.render('Poll.ejs', {polls:polls, username:username});

        });  
      }
      //db.run("INSERT INTO Users VALUES ('Messiii', 'barca', 'messi@gmail.com')");
      else { //username already exists
        console.log("The username already exists");
      
        res.render('index.ejs', {signUpErrorMessage: "The Username chosen already exists", loginErrorMessage: ""});  
        return;
      }

    });  

  });
};