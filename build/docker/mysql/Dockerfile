FROM mysql:latest
COPY ./mysql/sql/00_create_database.sql /docker-entrypoint-initdb.d/00_create_database.sql
COPY ./mysql/sql/01_user.sql /docker-entrypoint-initdb.d/01_user.sql
COPY ./mysql/my.cnf /etc/mysql/my.cnf
EXPOSE 3306
