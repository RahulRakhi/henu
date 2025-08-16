Write-Host "Setting up Gemini Chatbot..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install @google/generative-ai

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Yellow
"VITE_GEMINI_API_KEY=AIzaSyAQYVs6exBU05Nqmwb0iKiZCePl4OGb8JA" | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ""
Write-Host "Setup complete! You can now run:" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "The chatbot is ready to use with your Gemini API key!" -ForegroundColor Green
Read-Host "Press Enter to exit" 