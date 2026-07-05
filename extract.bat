@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: ============================================================
::  YSD Data Extractor Tool  /  YSDデータ抽出ツール
::  Trích xuất dữ liệu từ file Excel → Import DB
:: ============================================================

:: Kiểm tra Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [!] Node.js chưa được cài đặt. Vui lòng cài Node.js trước.
    echo      https://nodejs.org/
    echo.
    pause
    exit /b
)

:: Đường dẫn đến script
set "SCRIPT_DIR=%~dp0temp_ai"
set "INBOX_DIR=%~dp0temp_ai\inbox"
set "EXTRACTOR=%SCRIPT_DIR%\extract_inbox.mjs"

:MENU
cls
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║      YSD Data Extractor — データ自動取込ツール       ║
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║  Đặt file Excel vào thư mục:                        ║
echo  ║  %INBOX_DIR%
echo  ║                                                      ║
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║  [1] Xem danh sách file trong Inbox                 ║
echo  ║      インボックス内のファイル一覧表示                 ║
echo  ║                                                      ║
echo  ║  [2] Preview — Xem trước (không sửa DB)             ║
echo  ║      プレビュー（DBは変更しない）                     ║
echo  ║                                                      ║
echo  ║  [3] Import — Trích xuất và lưu vào DB              ║
echo  ║      インポート（DBに保存する）                       ║
echo  ║                                                      ║
echo  ║  [4] Mở thư mục Inbox                               ║
echo  ║      インボックスフォルダを開く                       ║
echo  ║                                                      ║
echo  ║  [5] Dọn dẹp — Di chuyển file đã xử lý vào _done/  ║
echo  ║      処理済みファイルを_done/へ移動                   ║
echo  ║                                                      ║
echo  ║  [0] Thoát / 終了                                    ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
set /p CHOICE="  Chọn / 選択 [0-5]: "

if "%CHOICE%"=="1" goto LIST
if "%CHOICE%"=="2" goto PREVIEW
if "%CHOICE%"=="3" goto APPLY
if "%CHOICE%"=="4" goto OPEN
if "%CHOICE%"=="5" goto CLEANUP
if "%CHOICE%"=="0" goto EXIT

echo.
echo  [!] Tùy chọn không hợp lệ. Vui lòng nhập 0-5.
timeout /t 2 /nobreak > nul
goto MENU

:LIST
echo.
echo  ─────────────────────────────────────────────────────
echo  📂 Danh sách file trong Inbox / インボックス内ファイル
echo  ─────────────────────────────────────────────────────
node "%EXTRACTOR%" --list
echo.
pause
goto MENU

:PREVIEW
echo.
echo  ─────────────────────────────────────────────────────
echo  🔍 Preview — Đang trích xuất dữ liệu...
echo  ─────────────────────────────────────────────────────
echo.
node "%EXTRACTOR%" --preview
echo.
echo  ─────────────────────────────────────────────────────
echo  ℹ  Preview xong. DB không thay đổi.
echo     DBは変更されていません。
echo  ─────────────────────────────────────────────────────
echo.
pause
goto MENU

:APPLY
echo.
echo  ─────────────────────────────────────────────────────
echo  ⚠  CẢNH BÁO / 警告
echo  ─────────────────────────────────────────────────────
echo  Thao tác này sẽ THÊM dữ liệu vào Database thật.
echo  この操作は実際のデータベースにデータを追加します。
echo.
set /p CONFIRM="  Tiếp tục? Nhập Y để xác nhận / Yを入力して確認 [Y/N]: "
if /i "%CONFIRM%" neq "Y" (
    echo.
    echo  Đã hủy. / キャンセルしました。
    timeout /t 2 /nobreak > nul
    goto MENU
)
echo.
echo  🚀 Đang import...
echo.
node "%EXTRACTOR%" --apply
echo.
echo  ─────────────────────────────────────────────────────
echo  ✅ Import hoàn thành. Kiểm tra log trong inbox/.
echo     インポート完了。inbox/のログを確認してください。
echo  ─────────────────────────────────────────────────────
echo.
set /p CLEANUP_AFTER="  Dọn dẹp file đã xử lý? / 処理済みファイルを移動しますか？ [Y/N]: "
if /i "%CLEANUP_AFTER%"=="Y" (
    node "%EXTRACTOR%" --cleanup
    echo  ✓ Đã dọn dẹp.
)
echo.
pause
goto MENU

:OPEN
explorer "%INBOX_DIR%"
goto MENU

:CLEANUP
echo.
echo  ─────────────────────────────────────────────────────
echo  🧹 Dọn dẹp Inbox / インボックスのクリーンアップ
echo  ─────────────────────────────────────────────────────
echo  File Excel sẽ được chuyển sang: inbox/_done/
echo.
set /p CONFIRM2="  Tiếp tục? [Y/N]: "
if /i "%CONFIRM2%" neq "Y" goto MENU
node "%EXTRACTOR%" --cleanup
echo.
pause
goto MENU

:EXIT
cls
echo.
echo  Tạm biệt! / さようなら！
echo.
exit /b 0
