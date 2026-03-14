@echo off
echo ================================
echo Ini-Yan Spark - Starting Backend
echo ================================
echo.

cd backend
echo Installing dependencies...
call npm install
echo.

echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
call npm run dev
