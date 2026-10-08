@echo off
chcp 65001 >nul
title PE-AN Standalone Realtime Hub
color 0B
echo ===================================================================
echo 🚀 PE-AN STANDALONE REALTIME HUB (GATEWAY v4.0)
echo 👉 Cầu nối thời gian thực 2 chiều PE - THOAN - AN
echo 👉 Cổng khởi động mặc định: 7654 (Tự động chuyển cổng nếu bị chiếm)
echo ===================================================================

cd /d "%~dp0"

set TARGET_PORT=7654
if not "%~1"=="" set TARGET_PORT=%~1

echo [INFO] Đang khởi chạy Local Hub tại cổng %TARGET_PORT% (127.0.0.1)...
echo.

node scripts\local_realtime_hub.js %TARGET_PORT%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Server bị dừng với mã lỗi %ERRORLEVEL%.
    pause
)
