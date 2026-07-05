@echo off
chcp 65001 >nul
title YSDMS - Đồng bộ dữ liệu từ Access CSV
echo ╔══════════════════════════════════════════════════╗
echo ║   YSDMS NextGen - Đồng bộ dữ liệu Access CSV   ║
echo ║   Incremental Import (chỉ thêm bản ghi mới)     ║
echo ╚══════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/2] Đang import Master Data (mold_masters, designs, physical_molds, products, cutters)...
echo.
call npx tsx scripts/migrate_v3_access_data.ts
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Lỗi ở bước 1. Vui lòng kiểm tra log ở trên.
    pause
    exit /b 1
)

echo.
echo [2/2] Đang import Jobs, Job Steps, Work Logs...
echo.
call npx tsx scripts/migrate_v3_jobs_worklogs.ts
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Lỗi ở bước 2. Vui lòng kiểm tra log ở trên.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   ✅ ĐỒNG BỘ HOÀN TẤT!                         ║
echo ║   Dữ liệu mới đã được cập nhật lên database.    ║
echo ╚══════════════════════════════════════════════════╝
echo.
pause
