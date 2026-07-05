@echo off
setlocal enabledelayedexpansion

:: Check for version argument
set VERSION=%1
if "%VERSION%"=="" (
    echo Usage: create_release.bat v0.1.6
    echo Please provide a version number.
    exit /b 1
)

set SOURCE_DIR=f:\AntiGravity\Projects\ysdms-nextgen
set DEST_DIR=f:\AntiGravity\Releases\ysdms-nextgen_releases\%VERSION%

echo ====================================================
echo YSDMS-NEXTGEN RELEASE PACKAGER
echo Source: %SOURCE_DIR%
echo Target: %DEST_DIR%
echo ====================================================

if exist "%DEST_DIR%" (
    echo WARNING: Target directory already exists. 
    echo Please use a new version number (Auto-Bump).
    exit /b 1
)

mkdir "%DEST_DIR%"

:: ROBOCOPY EXCLUSIONS
:: /XD : Exclude Directories (rác, data nặng, dev tools)
:: /XF : Exclude Files (script nháp, rar, zip)
:: /MIR : Mirror (Sạch sẽ)

robocopy "%SOURCE_DIR%" "%DEST_DIR%" /MIR /XD .git node_modules .next source_data .agents .ai release docs migrations /XF *.rar *.zip *.py out*.txt ts_error*.txt excel_*.txt schema_*.txt

:: Robocopy exit codes: 0-7 are successful (1 = files copied, 2 = extra files, 3 = copied + extra, etc.)
if %ERRORLEVEL% LSS 8 (
    echo.
    echo [SUCCESS] Release %VERSION% has been created at %DEST_DIR%
    exit /b 0
) else (
    echo.
    echo [ERROR] Robocopy failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
endlocal
