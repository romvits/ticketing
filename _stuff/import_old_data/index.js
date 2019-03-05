import mysql from 'mysql';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'ticketing_user',
  password : 'h4G7f8OP',
  port     : 3306
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});