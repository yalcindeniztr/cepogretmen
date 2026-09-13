@echo off
chcp 65001 >nul
title Maarif Tarih Planlayıcı - Portable (Şifresiz Doğrudan Giriş)
color 0A

echo ======================================================================
echo    TÜRKİYE YÜZYILI MAARİF MODELİ TARİH DERSİ PLANLAYICI
echo    Öğretmen: Yalçın DENİZ  ^|  Okul: Ballıca MTAL
echo    (Taşınabilir / Kurulumsuz / Şifresiz Doğrudan Açılış)
echo ======================================================================
echo.

cd /d "C:\Users\yalci\Desktop\Maarif_Planlayici_PORTABLE"
powershell -NoProfile -ExecutionPolicy Bypass -File "server.ps1"
pause
