@echo off
chcp 65001 >nul 2>&1
title PE-AN Standalone Realtime Hub
color 0B
echo ===================================================================
echo   PE-AN STANDALONE REALTIME HUB - GATEWAY v4.0
echo   Cau noi thoi gian thuc 2 chieu PE - THOAN - AN
echo   Cong khoi dong mac dinh: 7654 (Tu dong chuyen cong neu bi chiem)
echo ===================================================================

cd /d "%~dp0"

set TARGET_PORT=7654
if not "%~1"=="" set TARGET_PORT=%~1

echo [INFO] Dang khoi chay Local Hub tai cong %TARGET_PORT% (127.0.0.1)...
echo.

node scripts\local_realtime_hub.js %TARGET_PORT%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Server bi dung voi ma loi %ERRORLEVEL%.
    pause
)
