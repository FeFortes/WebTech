var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');

module.exports = function(req, res) {
	var numPollsSoFar = req.body.numPollsSoFar;
	var cookie = req.cookies.sessionCookie;
	var polls = [];
	console.log("getting more polls...");
	db.serialize(function() {
		db.get("SELECT username FROM Users WHERE sessionCookie = ?;", [ cookie ], (err, row) => {
      		if ((!(row === undefined)) && (!(cookie === null))) { //the brower already has a session cookie: no need to login, just redirect
      			console.log(row.username);
      			var username_session = row.username;
      			console.log("IMPORTANT:" + username_session);
      			console.log(numPollsSoFar - 0 + 20);
      			db.each("SELECT L.id as id, yes, total, vote, L.poll_text as poll_text, L.author as author, L.date_of_creation as date_of_creation FROM  (SELECT * FROM Polls WHERE id<= ? AND id>?) AS L LEFT JOIN (SELECT T.id, yes, total, vote, poll_text, author, date_of_creation  FROM (SELECT id AS id, SUM(vote) AS yes, Count(vote) AS total, ? AS username, poll_text, author, date_of_creation  FROM Polls INNER JOIN Votes ON Polls.id = Votes.poll_id GROUP BY Polls.id) AS T INNER JOIN Votes ON T.id = Votes.poll_id WHERE Votes.username=? AND T.id <= ? AND T.id > ?) AS K ON L.id = K.id;", [numPollsSoFar -0 + 20, numPollsSoFar, username_session, username_session, numPollsSoFar -0 + 20, numPollsSoFar], function(err, row) {
		 			if (err) {
		  	 			throw err;
		 			}	
		 			console.log(row);
		 			if(!(row.vote===null)) { //if the user has voted in the poll...
		 				console.log("voted: " + row.id);
		 				polls.push({ id: row.id, text: row.poll_text, username:row.author, date: row.date_of_creation, yes: row.yes, no: (row.total - row.yes), vote:row.vote});
		 			}
		 			else { //if the user has not voted in the poll
		 				console.log("not voted: " + row.id);
		 				polls.push({ id: row.id, text: row.poll_text, username:row.author, date: row.date_of_creation, yes: 'Yes', no: 'No', vote:null});
		 			}
				}, function() {
						res.json(polls);
				});
      		}
      	});

	}); 

	
	//return polls;
};


