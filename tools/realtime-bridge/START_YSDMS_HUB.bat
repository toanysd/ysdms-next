@echo off
title YSDMS NextGen PE-AN Realtime Hub v2.2.0
color 0b

echo =================================================================
echo   YSDMS NEXTGEN REALTIME BRIDGE HUB v2.2.0 [DEDICATED]
echo   Du an: YSDMS NextGen (Smart Factory / MES)
echo   Cau noi tu tri: Perplexity [PE] === Antigravity [AN]
echo   Bang SSOT: public.pe_an_messages (Supabase)
echo   Cong khoi dong: 3856+
echo =================================================================
echo.

cd /d "%~dp0"

echo [KIEM TRA] Node.js:
node -v
if errorlevel 1 (
    echo [LOI] Khong tim thay Node.js tren may tinh!
    pause
    exit /b 1
)

echo.
echo [KHOI DONG] Dang bat YSDMS Realtime Hub (Cong 3856+)...
echo [HUONG DAN] Giu nguyen cua so CMD nay de duy tri ket noi Realtime.
echo             Nhan Ctrl + C de dung server an toan.
echo =================================================================
echo.

node ysdms_realtime_hub.cjs 3856

echo.
echo [THONG BAO] Hub da ket thuc.
pause
