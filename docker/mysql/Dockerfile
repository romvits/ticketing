FROM mysql:latest
COPY ./mysql/sql/ /docker-entrypoint-initdb.d/
COPY ./mysql/my.cnf /etc/mysql/my.cnf
EXPOSE 3306
