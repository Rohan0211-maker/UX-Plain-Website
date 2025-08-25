export interface HotjarConfig {
  siteId: string
  accessToken: string
}

export interface HotjarData {
  recordings: number
  heatmaps: number
  funnels: number
  surveys: number
  polls: number
  userFeedback: Array<{
    type: string
    message: string
    rating?: number
    timestamp: string
  }>
  topPages: Array<{
    page: string
    recordings: number
    heatmaps: number
  }>
  userBehavior: {
    avgSessionDuration: number
    bounceRate: number
    conversionRate: number
  }
}

export class HotjarService {
  private config: HotjarConfig
  private baseUrl = 'https://insights.hotjar.com/api/v1'

  constructor(config: HotjarConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`Hotjar API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getSiteData(): Promise<HotjarData> {
    try {
      // Get recordings count
      const recordingsResponse = await this.makeRequest(`/sites/${this.config.siteId}/recordings/count`)
      
      // Get heatmaps count
      const heatmapsResponse = await this.makeRequest(`/sites/${this.config.siteId}/heatmaps/count`)
      
      // Get funnels count
      const funnelsResponse = await this.makeRequest(`/sites/${this.config.siteId}/funnels/count`)
      
      // Get surveys count
      const surveysResponse = await this.makeRequest(`/sites/${this.config.siteId}/surveys/count`)
      
      // Get polls count
      const pollsResponse = await this.makeRequest(`/sites/${this.config.siteId}/polls/count`)

      // Get user feedback
      const feedbackResponse = await this.makeRequest(`/sites/${this.config.siteId}/feedback`)
      
      // Get top pages
      const pagesResponse = await this.makeRequest(`/sites/${this.config.siteId}/pages`)
      
      // Get user behavior metrics
      const behaviorResponse = await this.makeRequest(`/sites/${this.config.siteId}/behavior`)

      return {
        recordings: recordingsResponse.count || 0,
        heatmaps: heatmapsResponse.count || 0,
        funnels: funnelsResponse.count || 0,
        surveys: surveysResponse.count || 0,
        polls: pollsResponse.count || 0,
        userFeedback: this.processFeedback(feedbackResponse.data || []),
        topPages: this.processPages(pagesResponse.data || []),
        userBehavior: {
          avgSessionDuration: behaviorResponse.avgSessionDuration || 0,
          bounceRate: behaviorResponse.bounceRate || 0,
          conversionRate: behaviorResponse.conversionRate || 0
        }
      }
    } catch (error) {
      console.error('Failed to fetch Hotjar data:', error)
      throw new Error('Failed to fetch Hotjar data')
    }
  }

  private processFeedback(feedback: any[]): Array<{
    type: string
    message: string
    rating?: number
    timestamp: string
  }> {
    return feedback.map(item => ({
      type: item.type || 'feedback',
      message: item.message || '',
      rating: item.rating,
      timestamp: item.timestamp || new Date().toISOString()
    })).slice(0, 10) // Limit to 10 items
  }

  private processPages(pages: any[]): Array<{
    page: string
    recordings: number
    heatmaps: number
  }> {
    return pages.map(item => ({
      page: item.page || '',
      recordings: item.recordings || 0,
      heatmaps: item.heatmaps || 0
    })).slice(0, 10) // Limit to 10 items
  }

  async getRecordings(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      
      const response = await this.makeRequest(`/sites/${this.config.siteId}/recordings?${params}`)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch recordings:', error)
      return []
    }
  }

  async getHeatmaps(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      
      const response = await this.makeRequest(`/sites/${this.config.siteId}/heatmaps?${params}`)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch heatmaps:', error)
      return []
    }
  }

  async getSurveys() {
    try {
      const response = await this.makeRequest(`/sites/${this.config.siteId}/surveys`)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest(`/sites/${this.config.siteId}`)
      return true
    } catch (error) {
      console.error('Hotjar connection test failed:', error)
      return false
    }
  }
}
