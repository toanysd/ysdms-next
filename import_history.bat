@echo off
chcp 65001 > nul
echo =====================================================================
echo   YSDMS NextGen - Khoi phuc lich su thao luan Antigravity
echo =====================================================================
echo.
echo [1] Kiem tra ung dung Antigravity...
tasklist /FI "IMAGENAME eq antigravity.exe" 2>NUL | find /I /N "antigravity.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo.
    echo [CANH BAO] Antigravity dang chay!
    echo Vui long DONG ANTIGRAVITY truoc khi thuc hien khoi phuc.
    echo.
    pause
)

echo [2] Dang chay script khoi phuc...
python scripts\import_antigravity_history.py

echo.
echo Hoan tat! Nhan phim bat ky de thoat...
pause > nul
