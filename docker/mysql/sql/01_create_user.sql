CREATE USER 'ticketing_user' IDENTIFIED BY 'h4G7f8OP';
GRANT ALL ON ticketing_db.* TO 'ticketing_user';
FLUSH PRIVILEGES;
