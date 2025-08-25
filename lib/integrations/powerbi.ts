export interface PowerBIConfig {
  workspaceId: string
  datasetId: string
  credentials: {
    clientId: string
    clientSecret: string
    tenantId: string
  }
}

export interface PowerBIData {
  datasets: Array<{
    id: string
    name: string
    tables: string[]
    refreshSchedule?: string
  }>
  reports: Array<{
    id: string
    name: string
    datasetId: string
    embedUrl: string
  }>
  dashboards: Array<{
    id: string
    name: string
    embedUrl: string
  }>
  data: Array<{
    table: string
    rows: any[]
    columns: string[]
  }>
}

export class PowerBIService {
  private config: PowerBIConfig
  private accessToken: string | null = null
  private baseUrl = 'https://api.powerbi.com/v1.0/myorg'

  constructor(config: PowerBIConfig) {
    this.config = config
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken
    }

    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.config.credentials.tenantId}/oauth2/token`
      
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        resource: 'https://analysis.windows.net/powerbi/api'
      })

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      console.error('Failed to get PowerBI access token:', error)
      throw new Error('Failed to authenticate with PowerBI')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAccessToken()
    const url = `${this.baseUrl}${endpoint}`
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`PowerBI API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getWorkspaceData(): Promise<PowerBIData> {
    try {
      // Get datasets in the workspace
      const datasetsResponse = await this.makeRequest(`/groups/${this.config.workspaceId}/datasets`)
      
      // Get reports in the workspace
      const reportsResponse = await this.makeRequest(`/groups/${this.config.workspaceId}/reports`)
      
      // Get dashboards in the workspace
      const dashboardsResponse = await this.makeRequest(`/groups/${this.config.workspaceId}/dashboards`)

      // Get data from the specified dataset
      const dataResponse = await this.getDatasetData()

      return {
        datasets: datasetsResponse.value.map((dataset: any) => ({
          id: dataset.id,
          name: dataset.name,
          tables: dataset.tables?.map((table: any) => table.name) || [],
          refreshSchedule: dataset.refreshSchedule
        })),
        reports: reportsResponse.value.map((report: any) => ({
          id: report.id,
          name: report.name,
          datasetId: report.datasetId,
          embedUrl: report.embedUrl
        })),
        dashboards: dashboardsResponse.value.map((dashboard: any) => ({
          id: dashboard.id,
          name: dashboard.name,
          embedUrl: dashboard.embedUrl
        })),
        data: dataResponse
      }
    } catch (error) {
      console.error('Failed to fetch PowerBI data:', error)
      throw new Error('Failed to fetch PowerBI data')
    }
  }

  private async getDatasetData() {
    try {
      // Get tables in the dataset
      const tablesResponse = await this.makeRequest(`/groups/${this.config.workspaceId}/datasets/${this.config.datasetId}/tables`)
      
      const data: Array<{
        table: string
        rows: any[]
        columns: string[]
      }> = []

      // Get data from each table (limit to first 100 rows for performance)
      for (const table of tablesResponse.value.slice(0, 5)) { // Limit to 5 tables
        try {
          const tableDataResponse = await this.makeRequest(
            `/groups/${this.config.workspaceId}/datasets/${this.config.datasetId}/tables/${table.name}/rows?$top=100`
          )
          
          data.push({
            table: table.name,
            rows: tableDataResponse.value || [],
            columns: Object.keys(tableDataResponse.value?.[0] || {})
          })
        } catch (error) {
          console.error(`Failed to fetch data from table ${table.name}:`, error)
          // Continue with other tables
        }
      }

      return data
    } catch (error) {
      console.error('Failed to fetch dataset data:', error)
      return []
    }
  }

  async getReportEmbedUrl(reportId: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/groups/${this.config.workspaceId}/reports/${reportId}`)
      return response.embedUrl
    } catch (error) {
      console.error('Failed to get report embed URL:', error)
      throw new Error('Failed to get report embed URL')
    }
  }

  async getDashboardEmbedUrl(dashboardId: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/groups/${this.config.workspaceId}/dashboards/${dashboardId}`)
      return response.embedUrl
    } catch (error) {
      console.error('Failed to get dashboard embed URL:', error)
      throw new Error('Failed to get dashboard embed URL')
    }
  }

  async refreshDataset(): Promise<boolean> {
    try {
      await this.makeRequest(`/groups/${this.config.workspaceId}/datasets/${this.config.datasetId}/refreshes`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Failed to refresh dataset:', error)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest(`/groups/${this.config.workspaceId}`)
      return true
    } catch (error) {
      console.error('PowerBI connection test failed:', error)
      return false
    }
  }
}
