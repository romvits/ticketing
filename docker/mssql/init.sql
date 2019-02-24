RESTORE DATABASE ILMDEV FROM DISK = "/tmp/backup/import.bak" WITH MOVE "INFRALIFE@CFL_POC_DATA" TO "/var/opt/mssql/data/ILMDEV.mdf", MOVE "INFRALIFE@CFL_POC_LOG" TO "/var/opt/mssql/data/ILMDEV_1.ldf";
GO
CREATE LOGIN zak_experte WITH PASSWORD = 'zak', CHECK_POLICY = OFF, DEFAULT_DATABASE = [ILMDEV];
GO
CREATE USER zak_experte FOR LOGIN zak_experte;
GO
USE ILMDEV; EXEC sp_addrolemember 'db_owner', 'zak_experte'; ALTER AUTHORIZATION ON DATABASE::ILMDEV to zak_experte;
GO
