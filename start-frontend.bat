@echo off
echo ==================================
echo Ini-Yan Spark - Starting Frontend
echo ==================================
echo.

echo Installing dependencies...
call npm install
echo.

echo Starting frontend server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
call npm run dev
