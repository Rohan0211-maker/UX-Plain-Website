import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'UXplain - AI-Powered UX Analysis Platform',
    template: '%s | UXplain'
  },
  description: 'Transform Figma designs into actionable UX insights in seconds using AI. Connect your data tools, get comprehensive analysis, and receive specific recommendations to boost conversions instantly.',
  keywords: ['UX analysis', 'Figma', 'AI', 'user experience', 'design analysis', 'conversion optimization', 'analytics'],
  authors: [{ name: 'UXplain Team' }],
  creator: 'UXplain',
  publisher: 'UXplain',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://uxplain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uxplain.com',
    title: 'UXplain - AI-Powered UX Analysis Platform',
    description: 'Transform Figma designs into actionable UX insights in seconds using AI.',
    siteName: 'UXplain',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UXplain - AI-Powered UX Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UXplain - AI-Powered UX Analysis Platform',
    description: 'Transform Figma designs into actionable UX insights in seconds using AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-white.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
