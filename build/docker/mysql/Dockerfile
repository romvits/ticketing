FROM mysql:latest
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* $ && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG=C.UTF-8
COPY ./mysql/my.cnf /etc/mysql/my.cnf
EXPOSE 3306 33060
