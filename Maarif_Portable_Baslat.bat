@echo off
chcp 65001 >nul
title Türkiye Yüzyılı Maarif Modeli Tarih Planlayıcı
color 0A

cd /d "C:\Users\yalci\Desktop\Maarif_Planlayici_PORTABLE"

if exist "Maarif_Baslat_Portable.bat" (
    call "Maarif_Baslat_Portable.bat"
    goto end
)

if exist "server.js" (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        node server.js
        goto end
    )
)

if exist "server.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "server.ps1"
    goto end
)

echo.
echo [HATA] Maarif_Planlayici_PORTABLE klasörü bulunamadı!
echo Lütfen masaüstündeki klasörü silmediğinizden emin olunuz.
pause

:end
