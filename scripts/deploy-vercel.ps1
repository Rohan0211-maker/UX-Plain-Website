# UXplain Vercel Deployment Script for Windows
Write-Host "🚀 UXplain Vercel Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in
try {
    $whoami = vercel whoami
    Write-Host "✅ Logged in to Vercel as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel. Please login:" -ForegroundColor Red
    vercel login
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "2. Configure your cloud database (Postgres/Supabase)" -ForegroundColor White
Write-Host "3. Test all features on live site" -ForegroundColor White
Write-Host "4. Update PayPal to production mode" -ForegroundColor White
Write-Host ""
Write-Host "📚 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
