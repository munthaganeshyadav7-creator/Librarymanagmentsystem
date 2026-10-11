@echo off
title College Library Management System - Backend Server
echo ===================================================
echo Starting Spring Boot Backend (Port 8080)
echo ===================================================

cd /d "%~dp0backend"

REM Set JAVA_HOME if not already set in system environment
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\jbr" (
        set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\jbr"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
    )
)

if exist "target\library-management-system-1.0.0.jar" (
    echo Launching packaged JAR...
    "%JAVA_HOME%\bin\java.exe" -jar target\library-management-system-1.0.0.jar
) else (
    echo Running via Maven...
    call "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" spring-boot:run
)

pause
