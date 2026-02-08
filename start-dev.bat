@echo off
echo ========================================
echo   Stock Analyzer - Development Setup
echo ========================================
echo.

echo Checking directories...
if not exist "stock-analyzer-backend" (
    echo ERROR: stock-analyzer-backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "stock-analyzer-frontend" (
    echo ERROR: stock-analyzer-frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0stock-analyzer-backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0stock-analyzer-frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened:
echo   1. Backend Server (black window)
echo   2. Frontend Server (black window)
echo.
echo Wait for both to finish starting, then open:
echo   http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
