@echo off
REM Blood Donor Finder System — Database Setup Script
REM Usage: Update the MySQL credentials below, then run this script.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe"
set MYSQL_USER=root

REM Prompt for MySQL password
set /p MYSQL_PASS="Enter MySQL root password: "

%MYSQL_PATH% -u %MYSQL_USER% -p%MYSQL_PASS% < "%~dp0schema.sql"
echo Schema loaded.
%MYSQL_PATH% -u %MYSQL_USER% -p%MYSQL_PASS% < "%~dp0seed.sql"
echo Seed data loaded.
echo Done!
