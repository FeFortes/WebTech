// Node.js + Express server backend for petsapp

// run this once to create the initial database as the Users_file.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('Users_file.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE Users (username TEXT, password TEXT, email TEXT, flagLoggedIn BOOLEAN, sessionCookie TEXT, PRIMARY KEY (username));");
  db.run("CREATE TABLE Polls (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, date_of_creation TEXT, num_yes INTEGER, num_no INTEGER, poll_text TEXT);");
  db.run("CREATE TABLE Votes (username TEXT, poll_id INTEGER, vote INTEGER, PRIMARY KEY(username, poll_id));");

  // insert 3 rows of data:
  db.run("INSERT INTO Users VALUES ('Fernando FG', '123456', 'fer@gmail.com', False, NULL);");
  db.run("INSERT INTO Users VALUES ('Messi', 'barca', 'messi@gmail.com', False, NULL);");

  db.run("INSERT INTO Polls (author, date_of_creation, num_yes, num_no, poll_text) VALUES ('Fernando FG', '2012-11-04 14:55:45', 1, 1, 'Do you think drugs should be decriminalized?');");
  db.run("INSERT INTO Polls (author, date_of_creation, num_yes, num_no, poll_text) VALUES ('Messi', '2013-11-04 12:34:11', 2, 0, 'Are you in favor of death penalty?');");

  db.run("INSERT INTO Votes VALUES ('Fernando FG', 1, 1);");
  db.run("INSERT INTO Votes VALUES ('Fernando FG', 2, 1);");
  db.run("INSERT INTO Votes VALUES ('Messi', 1, 0);");
  db.run("INSERT INTO Votes VALUES ('Messi', 2, 1);");

  console.log('successfully created the tables in Users_file.db');

  // print them out to confirm their contents:
  db.each("SELECT username, password, email, flagLoggedIn, sessionCookie FROM Users;", (err, row) => {
      console.log(row.username + ": " + row.password + ": " + row.email + ": " + row.flagLoggedIn + ": " + row.sessionCookie);
  });

  db.each("SELECT id, author, date_of_creation, num_yes, num_no, poll_text FROM Polls;", (err, row) => {
      console.log(row.id + ": " + row.author + ": " + row.date_of_creation + ": " + row.num_yes + ": " + row.num_no + ": " + row.poll_text);
  });

  db.each("SELECT username, poll_id, vote FROM Votes;", (err, row) => {
      console.log(row.username + ": " + row.poll_id + ": " + row.vote);
  });
});

db.close();