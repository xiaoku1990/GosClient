@echo off
echo finding task...
tasklist|find /i "BeefindP2P.exe" || echo task not found. && exit /b 0

echo task found.
echo task killing...
taskkill /im BeefindP2P.exe /F
echo task killed.