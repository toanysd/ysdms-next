@echo off
echo ========================================================
echo      YSDMS-NEXTGEN - DATA SYNCHRONIZATION
echo ========================================================
echo.
echo Starting data merge process from csv-access-data and csv-web-data...
echo.

cd /d "%~dp0"
node scripts\smart_csv_merger.mjs

echo.
echo ========================================================
echo Synchronization Complete!
echo Data is ready in the csv-merged_output directory.
echo ========================================================
pause
