@echo off
title College Library Management System - Production Build
echo ===================================================================
echo Building Production Artifacts (Frontend + Backend)
echo ===================================================================

REM 1. Set PATH for Node if required
if exist "D:\student_eventregistration\tools\node-v20.18.0-win-x64" (
    set "PATH=D:\student_eventregistration\tools\node-v20.18.0-win-x64;%PATH%"
)

REM 2. Set JAVA_HOME if required
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\jbr" (
        set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\jbr"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
    )
)

echo.
echo [Step 1/3] Building React Frontend with Vite...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error building frontend!
    exit /b %ERRORLEVEL%
)

echo.
echo [Step 2/3] Bundling React distribution into Spring Boot static resources...
if not exist "%~dp0backend\src\main\resources\static" (
    mkdir "%~dp0backend\src\main\resources\static"
)
xcopy /E /Y /I "%~dp0frontend\dist\*" "%~dp0backend\src\main\resources\static\"

echo.
echo [Step 3/3] Packaging Spring Boot JAR with Maven...
cd /d "%~dp0backend"
call "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error building backend JAR!
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================================
echo PRODUCTION BUILD SUCCESSFUL!
echo Generated Unified JAR:
echo %~dp0backend\target\library-management-system-1.0.0.jar
echo ===================================================================
pause
