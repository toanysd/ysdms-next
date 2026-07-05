@echo off
color 0c
echo ==============================================================
echo.  DANG XOA BO NHO DEM (CACHE) CUA NEXT.JS DE FIX LOI...
echo ==============================================================

:: Tat toan bo tien trinh Node.js dang chay ngam (neu co)
taskkill /F /IM node.exe >nul 2>&1

:: Xoa thu muc .next
if exist .next (
    rmdir /S /Q .next
    echo.  - Da xoa thu muc .next thanh cong!
) else (
    echo.  - Thu muc .next khong ton tai hoac da duoc xoa.
)

echo.
echo ==============================================================
echo.  DA XOA CACHE XONG! 
echo.  BAY GIO BAN HAY CHAY LAI FILE "start_server.bat" NHE!
echo ==============================================================
echo.
pause
