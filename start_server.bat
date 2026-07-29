@echo off
title YSDMS Next-Gen Server (Turbopack Mode)
color 0b

echo ==================================================
echo   HE THONG YSDMS NEXT-GEN (POSTGRESQL + NEXT.JS)
echo ==================================================
echo.

echo ==================================================
echo   DANG KHOI CHAY TRINH MAY CHU CUC BO...
echo   (Dang su dung Turbopack cua Next.js)
echo ==================================================

:: Xoa cache Webpack (.next) de tranh loi ChunkLoadError hoac SyntaxError
if exist .next (
    echo Dang xoa cache .next...
    rmdir /s /q .next
)

:: Cho 10 giay cho server Next.js khoi dong xong roi tu dong bat trinh duyet
start /b cmd /c "timeout /t 10 >nul && explorer http://localhost:3000"

call npm run dev -- -H 0.0.0.0

echo.
pause
