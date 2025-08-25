import { google } from 'googleapis'

export interface GoogleAnalyticsConfig {
  propertyId: string
  credentials: {
    client_email: string
    private_key: string
    client_id: string
  }
}

export interface AnalyticsData {
  pageViews: number
  uniqueUsers: number
  sessions: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    pagePath: string
    pageViews: number
  }>
  topSources: Array<{
    source: string
    sessions: number
  }>
}

export class GoogleAnalyticsService {
  private config: GoogleAnalyticsConfig
  private analytics: any

  constructor(config: GoogleAnalyticsConfig) {
    this.config = config
    this.initializeAnalytics()
  }

  private async initializeAnalytics() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly']
      })

      this.analytics = google.analyticsdata({
        version: 'v1beta',
        auth
      })
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
      throw new Error('Failed to initialize Google Analytics service')
    }
  }

  async getAnalyticsData(startDate: string, endDate: string): Promise<AnalyticsData> {
    try {
      const [response] = await this.analytics.properties.runReport({
        property: `properties/${this.config.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate
            }
          ],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'totalUsers' },
            { name: 'sessions' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ],
          dimensions: [
            { name: 'pagePath' },
            { name: 'sessionSource' }
          ],
          limit: 10
        }
      })

      // Process the response
      const metrics = response.rows?.[0]?.metricValues || []
      const pageViews = parseInt(metrics[0]?.value || '0')
      const uniqueUsers = parseInt(metrics[1]?.value || '0')
      const sessions = parseInt(metrics[2]?.value || '0')
      const bounceRate = parseFloat(metrics[3]?.value || '0')
      const avgSessionDuration = parseFloat(metrics[4]?.value || '0')

      // Get top pages
      const topPages = await this.getTopPages(startDate, endDate)
      
      // Get top sources
      const topSources = await this.getTopSources(startDate, endDate)

      return {
        pageViews,
        uniqueUsers,
        sessions,
        bounceRate,
        avgSessionDuration,
        topPages,
        topSources
      }
    } catch (error) {
      console.error('Failed to fetch Google Analytics data:', error)
      throw new Error('Failed to fetch analytics data')
    }
  }

  private async getTopPages(startDate: string, endDate: string) {
    try {
      const [response] = await this.analytics.properties.runReport({
        property: `properties/${this.config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'screenPageViews' }],
          dimensions: [{ name: 'pagePath' }],
          limit: 10,
          orderBys: [
            {
              metric: { metricName: 'screenPageViews' },
              desc: true
            }
          ]
        }
      })

      return (response.rows || []).map(row => ({
        pagePath: row.dimensionValues?.[0]?.value || '',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0')
      }))
    } catch (error) {
      console.error('Failed to fetch top pages:', error)
      return []
    }
  }

  private async getTopSources(startDate: string, endDate: string) {
    try {
      const [response] = await this.analytics.properties.runReport({
        property: `properties/${this.config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'sessions' }],
          dimensions: [{ name: 'sessionSource' }],
          limit: 10,
          orderBys: [
            {
              metric: { metricName: 'sessions' },
              desc: true
            }
          ]
        }
      })

      return (response.rows || []).map(row => ({
        source: row.dimensionValues?.[0]?.value || '',
        sessions: parseInt(row.metricValues?.[0]?.value || '0')
      }))
    } catch (error) {
      console.error('Failed to fetch top sources:', error)
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]
      await this.getAnalyticsData(today, today)
      return true
    } catch (error) {
      console.error('Google Analytics connection test failed:', error)
      return false
    }
  }
}
