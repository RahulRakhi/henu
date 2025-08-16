@echo off
echo Setting up Gemini Chatbot...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo Node.js found! Installing dependencies...
npm install @google/generative-ai

echo.
echo Creating .env file...
echo VITE_GEMINI_API_KEY=AIzaSyAQYVs6exBU05Nqmwb0iKiZCePl4OGb8JA > .env

echo.
echo Setup complete! You can now run:
echo npm run dev
echo.
echo The chatbot is ready to use with your Gemini API key!
pause 