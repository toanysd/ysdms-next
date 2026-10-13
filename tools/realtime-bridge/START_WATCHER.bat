@echo off
title OMNILINGUIST Sentinel Watcher v1.0
color 0a

echo =================================================================
echo   OMNILINGUIST SENTINEL WATCHER v1.0 [HARDENED]
echo   Du an: OmniLinguist (N5-N1 Cultivation RPG)
echo   Vai tro: AN - Nhan chi thi tu Hub va bao cao lai (ACK)
echo =================================================================
echo.

cd /d "%~dp0"

echo [KIEM TRA] Python:
python --version
if errorlevel 1 (
    echo [LOI] Khong tim thay Python tren may tinh!
    pause
    exit /b 1
)

echo.
echo [KHOI DONG] Dang bat Sentinel Watcher (Loop Mode)...
echo [HUONG DAN] Giu nguyen cua so CMD nay de AN san sang tiep nhan chi thi.
echo             Nhan Ctrl + C de dung watcher.
echo =================================================================
echo.

python watch_directive.py --loop

echo.
echo [THONG BAO] Watcher da ket thuc.
pause
