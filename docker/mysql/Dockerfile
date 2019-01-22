FROM mysql:latest
COPY ./docker/mysql/sql/ /docker-entrypoint-initdb.d/
COPY ./docker/mysql/my.cnf /etc/mysql/my.cnf
EXPOSE 3306
