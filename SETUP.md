# Integration Setup Guide

This guide will help you set up the required API keys and environment variables for your integrations.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Required for All Integrations
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Google Analytics
```bash
# Google Analytics API
GOOGLE_ANALYTICS_CLIENT_ID="your-google-client-id"
GOOGLE_ANALYTICS_CLIENT_SECRET="your-google-client-secret"
GOOGLE_ANALYTICS_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"

# Optional: Service Account (for server-to-server auth)
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
```

**How to get Google Analytics API keys:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Analytics Data API
4. Create OAuth 2.0 credentials
5. Download the service account key JSON file

### Hotjar
```bash
# Hotjar API
HOTJAR_API_KEY="your-hotjar-api-key"
HOTJAR_SITE_ID="your-hotjar-site-id"
```

**How to get Hotjar API keys:**
1. Log into your Hotjar account
2. Go to Settings > API
3. Generate a new API key
4. Note your Site ID from the tracking code

### Power BI
```bash
# Power BI API
POWERBI_CLIENT_ID="your-powerbi-client-id"
POWERBI_CLIENT_SECRET="your-powerbi-client-secret"
POWERBI_TENANT_ID="your-powerbi-tenant-id"
```

**How to get Power BI API keys:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure Active Directory
3. Get the Client ID and Client Secret
4. Note your Tenant ID

### Mixpanel
```bash
# Mixpanel API
MIXPANEL_API_SECRET="your-mixpanel-api-secret"
MIXPANEL_PROJECT_ID="your-mixpanel-project-id"
```

**How to get Mixpanel API keys:**
1. Log into your Mixpanel account
2. Go to Project Settings > API
3. Copy the API Secret
4. Note your Project ID

### Amplitude
```bash
# Amplitude API
AMPLITUDE_API_KEY="your-amplitude-api-key"
AMPLITUDE_SECRET_KEY="your-amplitude-secret-key"
```

**How to get Amplitude API keys:**
1. Log into your Amplitude account
2. Go to Settings > Projects
3. Select your project
4. Copy the API Key and Secret Key

## Getting Started

1. **Copy the environment variables** above to your `.env.local` file
2. **Fill in your actual API keys** for the integrations you want to use
3. **Restart your development server** to load the new environment variables
4. **Open the Integrations dashboard** and click "Add Integration"
5. **Select your integration type** and follow the setup wizard
6. **Test your connection** before creating the integration

## Security Notes

- **Never commit** your `.env.local` file to version control
- **Use strong, unique** API keys for each service
- **Rotate keys regularly** for production environments
- **Limit API permissions** to only what's necessary
- **Monitor API usage** to detect any unauthorized access

## Troubleshooting

### Common Issues

1. **"API key not found" errors**
   - Check that your `.env.local` file exists
   - Verify the variable names match exactly
   - Restart your development server

2. **"Unauthorized" errors**
   - Verify your API keys are correct
   - Check if your keys have expired
   - Ensure you have the right permissions

3. **"Rate limit exceeded" errors**
   - Check your API usage limits
   - Implement rate limiting in your code
   - Contact the service provider if needed

### Getting Help

- Check the integration-specific documentation links in the setup wizard
- Review the browser console for detailed error messages
- Check the integration logs in the dashboard
- Verify your API keys are working with the service's test endpoints

## Next Steps

After setting up your integrations:

1. **Test the connections** to ensure everything works
2. **Configure sync schedules** for automatic data updates
3. **Set up webhooks** for real-time data updates
4. **Monitor your integrations** using the dashboard
5. **Export data** when needed for analysis

Happy integrating! 🚀
