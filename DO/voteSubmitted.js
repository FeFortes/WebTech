var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');
var getPolls = require('./pollInterface/getPolls.js');

module.exports = function(req, res) {
	var cookie = req.cookies.sessionCookie;
	var id = req.body.pollId;
	var vote = req.body.vote;
  	
	//TODO: CHECK WHICH USER IS LOGGED IN AND IF HE/SHE HAS ALREADY VOTTED ON THAT POLL
	console.log("handling submission!");
	db.serialize(function() { //make join of tables
		db.get("SELECT username FROM Users WHERE sessionCookie = ?;", [ cookie ], (err, row) => {
      		if ((!(row === undefined)) && (!(cookie === null))) { //the browser has a cookie session: the client is logged in
      			var username = row.username;
      			console.log("username votting: " + username);

      			//check if the user has already votted on that poll
      			db.get("SELECT Count(username) as f FROM Votes WHERE poll_id = ? AND username = ?;", [ id, username ], (err, row) => {
      				if (!row.f) {
      					console.log("USERNAME HAS NOT VOTED: ");



					  	db.run("INSERT INTO Votes VALUES (?, ?, ?);", [ username, id, vote ], function(err, row) {
					 		if (err) {
					  			throw err;
					 		}	
					 		console.log("inserted values: (no space): " + username +" " + id + " " +vote);
					 		db.each("SELECT SUM(vote) as n_yes, Count(vote) as n_total FROM Votes WHERE poll_id = ?;", [ id ], (err, row) => {
							    if (err) {
							 		throw err;
								}
							   console.log(row.n_yes + ": " + row.n_total +": "+ (row.n_yes/row.n_total) +": "+ ((row.n_total-row.n_yes)/row.n_total));
							   var Json_votes = {yes: row.n_yes, no: (row.n_total-row.n_yes)}; 
							   res.json(Json_votes);
							});
						});
					}
					else {
						console.log("USERNAME HAS ALREADY VOTTED");
						db.each("SELECT SUM(vote) as n_yes, Count(vote) as n_total FROM Votes WHERE poll_id = ?;", [ id ], (err, row) => {
						    if (err) {
						 		throw err;
							}
						   console.log(row.n_yes + ": " + row.n_total +": "+ (row.n_yes/row.n_total) +": "+ ((row.n_total-row.n_yes)/row.n_total));
						   var Json_votes = {yes: row.n_yes, no: (row.n_total-row.n_yes)}; 
						   res.json(Json_votes);
						});
					}
				});
			}
		});

	}); 

};