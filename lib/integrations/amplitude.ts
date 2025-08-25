export interface AmplitudeConfig {
  apiKey: string
  secretKey: string
  projectId?: string
}

export interface AmplitudeData {
  events: Array<{
    event_type: string
    count: number
    unique_users: number
    properties: Record<string, any>
  }>
  users: {
    total: number
    active: number
    new: number
    returning: number
  }
  funnels: Array<{
    name: string
    steps: Array<{
      step: string
      count: number
      conversionRate: number
    }>
  }>
  retention: Array<{
    cohort: string
    day1: number
    day7: number
    day30: number
  }>
  topEvents: Array<{
    event_type: string
    count: number
    unique_users: number
  }>
  userProperties: Array<{
    property: string
    values: Array<{
      value: string
      count: number
    }>
  }>
}

export class AmplitudeService {
  private config: AmplitudeConfig
  private baseUrl = 'https://analytics.amplitude.com/api/2'

  constructor(config: AmplitudeConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // Add common parameters
    const searchParams = new URLSearchParams({
      ...params,
      api_key: this.config.apiKey
    })

    const response = await fetch(`${url}?${searchParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${this.config.apiKey}:${this.config.secretKey}`)}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Amplitude API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAnalyticsData(startDate: string, endDate: string): Promise<AmplitudeData> {
    try {
      // Get top events
      const topEvents = await this.getTopEvents(startDate, endDate)
      
      // Get user metrics
      const users = await this.getUserMetrics(startDate, endDate)
      
      // Get funnel data
      const funnels = await this.getFunnelData(startDate, endDate)
      
      // Get retention data
      const retention = await this.getRetentionData(startDate, endDate)
      
      // Get user properties
      const userProperties = await this.getUserProperties(startDate, endDate)

      return {
        events: [],
        users,
        funnels,
        retention,
        topEvents,
        userProperties
      }
    } catch (error) {
      console.error('Failed to fetch Amplitude data:', error)
      throw new Error('Failed to fetch Amplitude data')
    }
  }

  private async getTopEvents(startDate: string, endDate: string) {
    try {
      const response = await this.makeRequest('/events/segmentation', {
        e: '{"event_type":"*"}',
        start: startDate,
        end: endDate,
        m: 'totals'
      })

      return response.data.map((event: any) => ({
        event_type: event.event_type,
        count: event.count,
        unique_users: event.unique_users
      })).slice(0, 10)
    } catch (error) {
      console.error('Failed to fetch top events:', error)
      return []
    }
  }

  private async getUserMetrics(startDate: string, endDate: string) {
    try {
      const response = await this.makeRequest('/users/segmentation', {
        start: startDate,
        end: endDate,
        m: 'totals'
      })

      return {
        total: response.data?.total || 0,
        active: response.data?.active || 0,
        new: response.data?.new || 0,
        returning: response.data?.returning || 0
      }
    } catch (error) {
      console.error('Failed to fetch user metrics:', error)
      return { total: 0, active: 0, new: 0, returning: 0 }
    }
  }

  private async getFunnelData(startDate: string, endDate: string) {
    try {
      // This would typically require a funnel ID from Amplitude
      // For now, return a sample structure
      return [{
        name: 'User Onboarding',
        steps: [
          { step: 'Sign Up', count: 100, conversionRate: 100 },
          { step: 'Profile Setup', count: 80, conversionRate: 80 },
          { step: 'First Action', count: 60, conversionRate: 75 }
        ]
      }]
    } catch (error) {
      console.error('Failed to fetch funnel data:', error)
      return []
    }
  }

  private async getRetentionData(startDate: string, endDate: string) {
    try {
      // This would require specific cohort analysis setup
      // For now, return a sample structure
      return [{
        cohort: 'New Users',
        day1: 100,
        day7: 45,
        day30: 25
      }]
    } catch (error) {
      console.error('Failed to fetch retention data:', error)
      return []
    }
  }

  private async getUserProperties(startDate: string, endDate: string) {
    try {
      const response = await this.makeRequest('/users/segmentation', {
        start: startDate,
        end: endDate,
        m: 'totals',
        s: 'user_properties'
      })

      return response.data?.user_properties?.map((prop: any) => ({
        property: prop.property,
        values: prop.values?.map((val: any) => ({
          value: val.value,
          count: val.count
        })) || []
      })) || []
    } catch (error) {
      console.error('Failed to fetch user properties:', error)
      return []
    }
  }

  async getEventData(eventType: string, startDate?: string, endDate?: string) {
    try {
      const params: Record<string, any> = {
        e: `{"event_type":"${eventType}"}`,
        m: 'totals'
      }
      
      if (startDate) params.start = startDate
      if (endDate) params.end = endDate

      const response = await this.makeRequest('/events/segmentation', params)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch event data:', error)
      return []
    }
  }

  async getUserProfile(userId: string) {
    try {
      const response = await this.makeRequest('/users/search', {
        user_id: userId
      })
      return response.results?.[0] || null
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }

  async getCohortData(cohortId: string, startDate?: string, endDate?: string) {
    try {
      const params: Record<string, any> = {
        cohort_id: cohortId
      }
      
      if (startDate) params.start = startDate
      if (endDate) params.end = endDate

      const response = await this.makeRequest('/cohorts/retention', params)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch cohort data:', error)
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]
      await this.makeRequest('/events/segmentation', {
        e: '{"event_type":"*"}',
        start: today,
        end: today,
        m: 'totals'
      })
      return true
    } catch (error) {
      console.error('Amplitude connection test failed:', error)
      return false
    }
  }
}
