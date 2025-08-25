# 🚀 UXplain Deployment Guide - Vercel

## ✅ Current Status
- ✅ Database: SQLite (local development) → **Ready for Vercel deployment**
- ✅ Backend: Next.js API routes with Prisma
- ✅ Authentication: NextAuth.js configured
- ✅ AI Analysis: OpenAI integration ready
- ✅ Payments: PayPal integration ready
- ✅ Integrations: Google Analytics, Hotjar, PowerBI ready

## 🎯 What You Need to Do to Go Live

### 1. **Database Setup (REQUIRED)**
Since Vercel doesn't support SQLite, you need a cloud database:

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create Postgres database
vercel storage create postgres
```

**Option B: Supabase (Alternative)**
- Go to [supabase.com](https://supabase.com)
- Create new project
- Get connection string from Settings > Database
- Update DATABASE_URL in Vercel environment variables

### 2. **Update Environment Variables in Vercel**
Go to your Vercel project dashboard → Settings → Environment Variables:

```env
# Database (REQUIRED)
DATABASE_URL="your-postgres-connection-string"

# NextAuth.js (REQUIRED)
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="uxplain-secret-key-2024"

# OpenAI (REQUIRED)
OPENAI_API_KEY="your-openai-api-key"

# PayPal (REQUIRED for payments)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="live" # Change from "sandbox" to "live"

# JWT (REQUIRED)
JWT_SECRET="uxplain-jwt-secret-key-2024-secure"

# Optional Integrations
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="uxplain-files"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

FIGMA_ACCESS_TOKEN="your-figma-token"
GOOGLE_ANALYTICS_CLIENT_ID="your-ga-client-id"
GOOGLE_ANALYTICS_CLIENT_SECRET="your-ga-client-secret"
HOTJAR_SITE_ID="your-hotjar-site-id"
POWERBI_CLIENT_ID="your-powerbi-client-id"
POWERBI_CLIENT_SECRET="your-powerbi-client-secret"
```

### 3. **Update Database Schema for PostgreSQL**
If using PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. **Deploy to Vercel**

```bash
# Build and deploy
vercel --prod

# Or use GitHub integration:
# 1. Push code to GitHub
# 2. Connect repository in Vercel dashboard
# 3. Deploy automatically on push
```

### 5. **Post-Deployment Setup**

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

## 🔧 API Integration Setup

### **Google Analytics**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google Analytics API
4. Create service account and download JSON key
5. Add credentials to environment variables

### **Hotjar**
1. Go to [Hotjar](https://hotjar.com/)
2. Create account and get Site ID
3. Add `HOTJAR_SITE_ID` to environment variables

### **PowerBI**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register application in Azure AD
3. Get Client ID and Secret
4. Add to environment variables

### **PayPal (Production)**
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Switch from Sandbox to Live
3. Get production Client ID and Secret
4. Update environment variables

## 🚨 Critical Issues to Fix Before Launch

### **1. Database Connection**
- ❌ SQLite won't work on Vercel
- ✅ Use Vercel Postgres or Supabase

### **2. Environment Variables**
- ❌ Missing API keys will break features
- ✅ Set all required variables in Vercel dashboard

### **3. PayPal Production**
- ❌ Sandbox mode for testing only
- ✅ Switch to live mode for real payments

### **4. File Storage**
- ❌ Local file storage won't work on Vercel
- ✅ Use AWS S3 or Vercel Blob

## 📱 Testing Checklist

- [ ] Database connection works
- [ ] User registration/login works
- [ ] AI analysis generates results
- [ ] PayPal payments process
- [ ] Integrations fetch data
- [ ] File uploads work
- [ ] Real-time features work

## 🎉 Launch Steps

1. **Final Testing**: Test all features locally
2. **Database Migration**: Set up cloud database
3. **Environment Setup**: Configure all API keys
4. **Deploy**: Push to Vercel
5. **Verify**: Test all features on live site
6. **Launch**: Share your live URL!

## 🆘 If Something Breaks

1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check API rate limits
5. Review error logs in browser console

## 📞 Support
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Prisma Documentation: [prisma.io/docs](https://prisma.io/docs)
- NextAuth Documentation: [next-auth.js.org](https://next-auth.js.org)

---

**You're almost there! The hard part is done. Just set up the cloud database and deploy! 🚀**
