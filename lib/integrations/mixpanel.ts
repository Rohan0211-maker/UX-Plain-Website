export interface MixpanelConfig {
  projectId: string
  apiSecret: string
  username?: string
}

export interface MixpanelData {
  events: Array<{
    event: string
    count: number
    properties: Record<string, any>
  }>
  users: {
    total: number
    active: number
    new: number
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
    event: string
    count: number
    uniqueUsers: number
  }>
}

export class MixpanelService {
  private config: MixpanelConfig
  private baseUrl = 'https://mixpanel.com/api/2.0'

  constructor(config: MixpanelConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // Add common parameters
    const searchParams = new URLSearchParams({
      ...params,
      project_id: this.config.projectId.toString()
    })

    const response = await fetch(`${url}?${searchParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${this.config.apiSecret}:`)}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAnalyticsData(startDate: string, endDate: string): Promise<MixpanelData> {
    try {
      // Get top events
      const topEvents = await this.getTopEvents(startDate, endDate)
      
      // Get user metrics
      const users = await this.getUserMetrics(startDate, endDate)
      
      // Get funnel data
      const funnels = await this.getFunnelData(startDate, endDate)
      
      // Get retention data
      const retention = await this.getRetentionData(startDate, endDate)

      return {
        events: [],
        users,
        funnels,
        retention,
        topEvents
      }
    } catch (error) {
      console.error('Failed to fetch Mixpanel data:', error)
      throw new Error('Failed to fetch Mixpanel data')
    }
  }

  private async getTopEvents(startDate: string, endDate: string) {
    try {
      const response = await this.makeRequest('/events/top', {
        from_date: startDate,
        to_date: endDate,
        limit: 10
      })

      return response.data.map((event: any) => ({
        event: event.event,
        count: event.count,
        uniqueUsers: event.unique_users
      }))
    } catch (error) {
      console.error('Failed to fetch top events:', error)
      return []
    }
  }

  private async getUserMetrics(startDate: string, endDate: string) {
    try {
      const response = await this.makeRequest('/events/properties', {
        from_date: startDate,
        to_date: endDate,
        event: 'User Login',
        name: 'distinct_id'
      })

      return {
        total: response.data?.total || 0,
        active: response.data?.active || 0,
        new: response.data?.new || 0
      }
    } catch (error) {
      console.error('Failed to fetch user metrics:', error)
      return { total: 0, active: 0, new: 0 }
    }
  }

  private async getFunnelData(startDate: string, endDate: string) {
    try {
      // This would typically require a funnel ID from Mixpanel
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

  async getEventData(eventName: string, startDate?: string, endDate?: string) {
    try {
      const params: Record<string, any> = {
        event: eventName
      }
      
      if (startDate) params.from_date = startDate
      if (endDate) params.to_date = endDate

      const response = await this.makeRequest('/events/properties', params)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch event data:', error)
      return []
    }
  }

  async getUserProfile(distinctId: string) {
    try {
      const response = await this.makeRequest('/engage', {
        where: `distinct_id == "${distinctId}"`
      })
      return response.results?.[0] || null
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]
      await this.makeRequest('/events/top', {
        from_date: today,
        to_date: today,
        limit: 1
      })
      return true
    } catch (error) {
      console.error('Mixpanel connection test failed:', error)
      return false
    }
  }
}
