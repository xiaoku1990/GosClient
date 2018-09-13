@echo off
echo finding task...
tasklist|find /i "BeefindP2P.exe" || echo task not found. && echo task starting with ID %1... && start BeefindP2P.exe %1 && echo task started. && exit /b 0

echo task found.
echo task killing...
taskkill /im BeefindP2P.exe /F
echo task killed.
echo task starting with ID %1...
start BeefindP2P.exe %1
echo task started.