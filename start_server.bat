@echo off
title YSDMS Next-Gen Server (Webpack Mode)
color 0b

echo ==================================================
echo.  HE THONG YSDMS NEXT-GEN (POSTGRESQL + NEXT.JS)
echo ==================================================
echo.

echo ==================================================
echo.  DANG KHOI CHAY TRINH MAY CHU CUC BO...
echo.  (Trinh bien dich Webpack giup tranh loi native Windows)
echo ==================================================

:: Chờ 5 giây cho server Next.js khởi động xong rồi tự động bật trình duyệt
start /b cmd /c "timeout /t 5 >nul && start http://localhost:3001"

call npx next dev --webpack -p 3001

echo.
pause
