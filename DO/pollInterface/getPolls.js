var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users_file.db');
var cookieParser = require('cookie-parser');

module.exports = function(numPollsSoFar, res, username_session) {
//	return new Promise(resolve => {
//	var polls = [
//				    { id: 1, text: "Do you think drugs should be legalized?", username:"usr1", date: "today1" },
//				    { id: 2, text: "Do you think drugs should be legalized? Do you think drugs should be legalized? Do you think drugs should be legalized?", username:"usr2", date: "today2" },
//				    { id: 3, text: "text3", username:"usr3", date: "today3" },
//		];
	if(numPollsSoFar === 0) { //the user has just entered the page, so the page must be rendered
		var polls = [];
		console.log("getting polls...");
		db.serialize(function() {
	  		db.each("SELECT L.id as id, yes, total, vote, L.poll_text as poll_text, L.author as author, L.date_of_creation as date_of_creation FROM (SELECT * FROM Polls WHERE id<= 20) AS L LEFT JOIN (SELECT T.id, yes, total, vote, poll_text, author, date_of_creation FROM (SELECT id AS id, SUM(vote) AS yes, Count(vote) AS total, ? AS username, poll_text, author, date_of_creation FROM Polls INNER JOIN Votes ON Polls.id = Votes.poll_id GROUP BY Polls.id) AS T INNER JOIN Votes ON T.id = Votes.poll_id WHERE Votes.username=? AND T.id <= 20) AS K ON L.id = K.id;", [username_session, username_session], function(err, row) {
	 			if (err) {
	  	 			throw err;
	 			}	
	 			if(!(row.vote===null)) { //if the user has voted in the poll...
	 				polls.push({ id: row.id, text: row.poll_text, username:row.author, date: row.date_of_creation, yes: row.yes, no: (row.total - row.yes), vote:row.vote});
	 			}
	 			else { //if the user has not voted in the poll
	 				polls.push({ id: row.id, text: row.poll_text, username:row.author, date: row.date_of_creation, yes: 'Yes', no: 'No', vote:null});
	 			}
			}, function() {
				res.render('Poll.ejs', {polls:polls, username:username_session});
			});

		}); 
	}
	else {

	}
	
//});
	//return polls;
};


