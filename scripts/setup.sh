#!/bin/bash

# UXplain Setup Script
# This script sets up the UXplain development environment

set -e

echo "🚀 Setting up UXplain development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm version: $(pnpm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uxplain"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="uxplain-uploads"

# Stripe (for payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Redis (for caching and queues)
REDIS_URL="redis://localhost:6379"

# Application Settings
NODE_ENV="development"
APP_URL="http://localhost:3000"
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please update the environment variables in .env.local with your actual values"
else
    echo "✅ .env.local file already exists"
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL and create a database named 'uxplain'"
    echo "   You can use: createdb uxplain"
else
    echo "✅ PostgreSQL is running"
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo "⚠️  Redis is not running. Please start Redis server"
else
    echo "✅ Redis is running"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm db:generate

# Check if database exists and is accessible
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Testing database connection..."
    if pnpm db:push --accept-data-loss &> /dev/null; then
        echo "✅ Database connection successful"
    else
        echo "❌ Database connection failed. Please check your DATABASE_URL in .env.local"
    fi
else
    echo "⚠️  DATABASE_URL not set. Please update .env.local with your database URL"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual API keys and credentials"
echo "2. Start PostgreSQL and Redis if not already running"
echo "3. Run 'pnpm db:push' to set up the database schema"
echo "4. Run 'pnpm dev' to start the development server"
echo ""
echo "For more information, see the README.md file" 