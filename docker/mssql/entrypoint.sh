#!/bin/bash
database=ticketing
wait_time=15s
password=ComPle2Pword!

# wait for SQL Server to come up
echo importing data will start in $wait_time...
sleep $wait_time
echo importing data...

/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -i /tmp/init.sql


#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -Q 'RESTORE FILELISTONLY FROM DISK = "/tmp/backup/import.bak"' | tr -s ' ' | cut -d ' ' -f 1-2
#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U SA -P $password -Q 'RESTORE DATABASE ILMDEV FROM DISK = "/tmp/backup/import.bak" WITH MOVE "INFRALIFE@CFL_POC_DATA" TO "/var/opt/mssql/data/ILMDEV.mdf", MOVE "INFRALIFE@CFL_POC_LOG" TO "/var/opt/mssql/data/ILMDEV_1.ldf"'

#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U SA -P $password -Q "CREATE LOGIN zak_experte WITH PASSWORD = 'zak', CHECK_POLICY = OFF, DEFAULT_DATABASE = [ILMDEV]";

#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U SA -P $password -Q "CREATE USER zak_experte FOR LOGIN zak_experte";

#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U SA -P $password -Q "USE ILMDEV; EXEC sp_addrolemember 'db_owner', 'zak_experte'; ALTER AUTHORIZATION ON DATABASE::ILMDEV to zak_experte";

# run the init script to create the DB and the tables in /table
#/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -i /tmp/sql/00_create_database.sql

#for entry in "/tmp/sql/*.sql"
#do
#  echo executing $entry
#  /opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -i $entry
#done

#import the data from the csv files
#for entry in "data/*.csv"
#do
#  # i.e: transform /data/MyTable.csv to MyTable
#  shortname=$(echo $entry | cut -f 1 -d '.' | cut -f 2 -d '/')
#  tableName=$database.dbo.$shortname
#  echo importing $tableName from $entry
#  /opt/mssql-tools/bin/bcp $tableName in $entry -c -t',' -F 2 -S 0.0.0.0 -U sa -P $password
#done