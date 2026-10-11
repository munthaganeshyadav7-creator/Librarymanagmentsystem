@echo off
title College Library Management System - React Frontend
echo ===================================================
echo Starting React Vite Frontend (Port 5173)
echo ===================================================

cd /d "%~dp0frontend"

REM Prepend local Node.js path if needed
if exist "D:\student_eventregistration\tools\node-v20.18.0-win-x64" (
    set "PATH=D:\student_eventregistration\tools\node-v20.18.0-win-x64;%PATH%"
)

echo Starting Vite development server...
call npm run dev

pause
