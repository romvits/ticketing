FROM mcr.microsoft.com/mssql/server:2017-latest

RUN mkdir /var/opt/mssql
RUN useradd -d /var/opt/mssql -c "Microsoft SQL Server user" mssql
RUN chown mssql:mssql /var/opt/mssql -R

COPY ./mssql/init.sql /tmp/init.sql
RUN chown mssql:mssql /tmp/init.sql

COPY ./mssql/entrypoint.sh /tmp/entrypoint.sh
RUN chown mssql:mssql /tmp/entrypoint.sh

COPY ./mssql/backup /tmp/backup
RUN chown mssql:mssql /tmp/backup/*

RUN chmod +x /tmp/entrypoint.sh

ENV HOME=/var/opt/mssql
ENV APP_HOME=/var/opt/mssql

EXPOSE 1433
