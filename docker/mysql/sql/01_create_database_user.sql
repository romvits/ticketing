CREATE USER 'ticketing_user' IDENTIFIED WITH mysql_native_password BY 'h4G7f8OP';
GRANT ALL ON ticketing_db.* TO 'ticketing_user';
FLUSH PRIVILEGES;
