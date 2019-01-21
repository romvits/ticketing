FROM mysql:latest
COPY ./01_user.sql /docker-entrypoint-initdb.d/01_user.sql
COPY ./mysql/my.cnf /etc/mysql/my.cnf
EXPOSE 3306
