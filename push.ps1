# Push helper script for Historical Intelligence Platform
Clear-Host
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "  HISTORICAL INTELLIGENCE PLATFORM (HIP) CI" -ForegroundColor Gold
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Preparing to push files to: https://github.com/Blakbot-AI/adventurous-galileo.git" -ForegroundColor Gray
Write-Host ""

# Ensure we are on the main branch
git branch -M main

Write-Host "Starting Git Push..." -ForegroundColor Gold
Write-Host "--> Note: If a Windows login popup appears, please sign in to your GitHub account." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Your platform code is now live on GitHub!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Push failed. Check your GitHub repository name and connection." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to close this window..."
