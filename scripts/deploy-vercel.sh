#!/bin/bash

echo "🚀 UXplain Vercel Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI found"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login:"
    vercel login
else
    echo "✅ Logged in to Vercel"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📝 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your cloud database (Postgres/Supabase)"
echo "3. Test all features on live site"
echo "4. Update PayPal to production mode"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
