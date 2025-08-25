# UXplain - AI-Powered UX Analysis Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7.1-green)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)](https://tailwindcss.com/)

Transform your Figma designs into actionable UX insights in seconds using AI. Connect your data tools, get comprehensive analysis, and receive specific recommendations to boost conversions instantly.

## 🚀 Features

- **🤖 AI-Powered Analysis** - Get instant insights into your designs with advanced AI that understands UX principles
- **📊 Comprehensive Reports** - Generate detailed reports with actionable recommendations
- **👥 Team Collaboration** - Work together with your team to analyze designs and share insights
- **🔗 Data Integration** - Connect Google Analytics, Hotjar, Mixpanel, PowerBI, and more
- **🔒 Enterprise Security** - Bank-level security with SOC 2 compliance
- **⚡ Lightning Fast** - Analysis results in seconds, not hours

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI, Anthropic Claude
- **Deployment**: Docker, Vercel-ready
- **Monitoring**: Error boundaries, loading states, theme switching

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm or npm
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/uxplain.git
cd uxplain
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uxplain"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Run migrations
pnpm db:migrate

# (Optional) Open Prisma Studio
pnpm db:studio
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
uxplain/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── signin/            # Authentication pages
│   ├── signup/            # Registration pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── integrations/     # Integration-specific components
│   ├── theme-provider.tsx # Theme management
│   ├── error-boundary.tsx # Error handling
│   └── loading-spinner.tsx # Loading states
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── prisma.ts         # Database client
│   ├── integrations/     # Third-party integrations
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Additional stylesheets
```

## 🎨 Component Library

The platform includes a comprehensive set of UI components built with Radix UI and Tailwind CSS:

- **Buttons** - Multiple variants (default, gradient, success, warning, premium)
- **Cards** - Flexible content containers
- **Forms** - Accessible form components with validation
- **Navigation** - Responsive navigation components
- **Loading States** - Multiple spinner variants and loading components
- **Error Boundaries** - Graceful error handling
- **Theme Toggle** - Light/dark/system theme switching

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database

# Type Checking
pnpm type-check       # Run TypeScript compiler check
```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Your application URL | ✅ |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ |
| `OPENAI_API_KEY` | OpenAI API key for AI analysis | ❌ |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | ❌ |

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t uxplain .

# Run container
docker run -p 3000:3000 --env-file .env.local uxplain
```

## 🔒 Security Features

- **Authentication**: Secure NextAuth.js implementation
- **Database**: SQL injection protection with Prisma
- **API**: Rate limiting and input validation
- **Environment**: Secure environment variable handling
- **HTTPS**: Force HTTPS in production
- **CORS**: Configurable cross-origin resource sharing

## 📱 Responsive Design

The platform is built with a mobile-first approach and includes:

- Responsive breakpoints for all screen sizes
- Touch-friendly interactions
- Optimized mobile navigation
- Adaptive layouts for different devices

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Geist font with proper loading strategies
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Strategic caching strategies

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 📊 Monitoring & Analytics

- **Error Tracking**: Comprehensive error boundaries
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Privacy-focused analytics
- **Health Checks**: API health monitoring endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.uxplain.com](https://docs.uxplain.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/uxplain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/uxplain/discussions)
- **Email**: support@uxplain.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Prisma](https://www.prisma.io/) for the modern database toolkit
- [Vercel](https://vercel.com/) for deployment and hosting

---

Built with ❤️ by the UXplain team #   F o r c e   n e w   d e p l o y m e n t  
 