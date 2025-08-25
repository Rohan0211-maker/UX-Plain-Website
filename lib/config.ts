export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || "file:./dev.db"
  },

  // NextAuth
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000"
  },

  // Google Analytics API
  googleAnalytics: {
    clientId: process.env.GOOGLE_ANALYTICS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ANALYTICS_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_ANALYTICS_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google",
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
  },

  // Hotjar API
  hotjar: {
    apiKey: process.env.HOTJAR_API_KEY,
    siteId: process.env.HOTJAR_SITE_ID
  },

  // PowerBI API
  powerbi: {
    clientId: process.env.POWERBI_CLIENT_ID,
    clientSecret: process.env.POWERBI_CLIENT_SECRET,
    tenantId: process.env.POWERBI_TENANT_ID
  },

  // Mixpanel API
  mixpanel: {
    apiSecret: process.env.MIXPANEL_API_SECRET,
    projectId: process.env.MIXPANEL_PROJECT_ID
  },

  // Amplitude API
  amplitude: {
    apiKey: process.env.AMPLITUDE_API_KEY,
    secretKey: process.env.AMPLITUDE_SECRET_KEY
  }
}

// Validation functions
export const validateConfig = () => {
  const missingKeys: string[] = []

  // Check required keys for each integration
  if (!config.googleAnalytics.clientId || !config.googleAnalytics.clientSecret) {
    missingKeys.push('Google Analytics (GOOGLE_ANALYTICS_CLIENT_ID, GOOGLE_ANALYTICS_CLIENT_SECRET)')
  }

  if (!config.hotjar.apiKey || !config.hotjar.siteId) {
    missingKeys.push('Hotjar (HOTJAR_API_KEY, HOTJAR_SITE_ID)')
  }

  if (!config.powerbi.clientId || !config.powerbi.clientSecret || !config.powerbi.tenantId) {
    missingKeys.push('PowerBI (POWERBI_CLIENT_ID, POWERBI_CLIENT_SECRET, POWERBI_TENANT_ID)')
  }

  if (!config.mixpanel.apiSecret || !config.mixpanel.projectId) {
    missingKeys.push('Mixpanel (MIXPANEL_API_SECRET, MIXPANEL_PROJECT_ID)')
  }

  if (!config.amplitude.apiKey || !config.amplitude.secretKey) {
    missingKeys.push('Amplitude (AMPLITUDE_API_KEY, AMPLITUDE_SECRET_KEY)')
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys
  }
}

// Helper to get config for specific integration type
export const getIntegrationConfig = (type: string) => {
  switch (type.toUpperCase()) {
    case 'GOOGLE_ANALYTICS':
      return config.googleAnalytics
    case 'HOTJAR':
      return config.hotjar
    case 'POWERBI':
      return config.powerbi
    case 'MIXPANEL':
      return config.mixpanel
    case 'AMPLITUDE':
      return config.amplitude
    default:
      return null
  }
}
