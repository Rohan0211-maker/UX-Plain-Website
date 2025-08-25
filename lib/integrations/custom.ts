export interface CustomIntegrationConfig {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers: Record<string, string>
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2'
    credentials: Record<string, any>
  }
  params?: Record<string, any>
  body?: Record<string, any>
  responseMapping?: {
    success?: string
    data?: string
    error?: string
  }
}

export interface CustomIntegrationData {
  success: boolean
  data: any
  metadata: {
    endpoint: string
    method: string
    timestamp: string
    responseTime: number
  }
}

export class CustomIntegrationService {
  private config: CustomIntegrationConfig

  constructor(config: CustomIntegrationConfig) {
    this.config = config
  }

  private async makeRequest(endpoint?: string, method?: string, body?: any): Promise<any> {
    const url = endpoint || this.config.endpoint
    const requestMethod = method || this.config.method
    const requestBody = body || this.config.body

    const headers = this.buildHeaders()
    const requestOptions: RequestInit = {
      method: requestMethod,
      headers
    }

    if (requestBody && ['POST', 'PUT', 'PATCH'].includes(requestMethod)) {
      requestOptions.body = JSON.stringify(requestBody)
    }

    // Add query parameters for GET requests
    if (requestMethod === 'GET' && this.config.params) {
      const urlObj = new URL(url)
      Object.entries(this.config.params).forEach(([key, value]) => {
        urlObj.searchParams.append(key, value.toString())
      })
      url = urlObj.toString()
    }

    const startTime = Date.now()
    const response = await fetch(url, requestOptions)
    const responseTime = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    
    return {
      data: responseData,
      responseTime,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers = { ...this.config.headers }

    // Add authentication headers
    switch (this.config.auth.type) {
      case 'basic':
        const { username, password } = this.config.auth.credentials
        headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`
        break
      
      case 'bearer':
        const { token } = this.config.auth.credentials
        headers['Authorization'] = `Bearer ${token}`
        break
      
      case 'api_key':
        const { key, headerName = 'X-API-Key' } = this.config.auth.credentials
        headers[headerName] = key
        break
      
      case 'oauth2':
        const { accessToken } = this.config.auth.credentials
        headers['Authorization'] = `Bearer ${accessToken}`
        break
    }

    // Ensure Content-Type is set for requests with body
    if (['POST', 'PUT', 'PATCH'].includes(this.config.method) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  async getData(): Promise<CustomIntegrationData> {
    try {
      const result = await this.makeRequest()
      
      return {
        success: true,
        data: this.mapResponse(result.data),
        metadata: {
          endpoint: this.config.endpoint,
          method: this.config.method,
          timestamp: new Date().toISOString(),
          responseTime: result.responseTime
        }
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        metadata: {
          endpoint: this.config.endpoint,
          method: this.config.method,
          timestamp: new Date().toISOString(),
          responseTime: 0
        }
      }
    }
  }

  async postData(data: any): Promise<CustomIntegrationData> {
    try {
      const result = await this.makeRequest(this.config.endpoint, 'POST', data)
      
      return {
        success: true,
        data: this.mapResponse(result.data),
        metadata: {
          endpoint: this.config.endpoint,
          method: 'POST',
          timestamp: new Date().toISOString(),
          responseTime: result.responseTime
        }
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        metadata: {
          endpoint: this.config.endpoint,
          method: 'POST',
          timestamp: new Date().toISOString(),
          responseTime: 0
        }
      }
    }
  }

  async putData(data: any): Promise<CustomIntegrationData> {
    try {
      const result = await this.makeRequest(this.config.endpoint, 'PUT', data)
      
      return {
        success: true,
        data: this.mapResponse(result.data),
        metadata: {
          endpoint: this.config.endpoint,
          method: 'PUT',
          timestamp: new Date().toISOString(),
          responseTime: result.responseTime
        }
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        metadata: {
          endpoint: this.config.endpoint,
          method: 'PUT',
          timestamp: new Date().toISOString(),
          responseTime: 0
        }
      }
    }
  }

  async deleteData(): Promise<CustomIntegrationData> {
    try {
      const result = await this.makeRequest(this.config.endpoint, 'DELETE')
      
      return {
        success: true,
        data: this.mapResponse(result.data),
        metadata: {
          endpoint: this.config.endpoint,
          method: 'DELETE',
          timestamp: new Date().toISOString(),
          responseTime: result.responseTime
        }
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        metadata: {
          endpoint: this.config.endpoint,
          method: 'DELETE',
          timestamp: new Date().toISOString(),
          responseTime: 0
        }
      }
    }
  }

  private mapResponse(data: any): any {
    if (!this.config.responseMapping) {
      return data
    }

    const mapped: any = {}
    
    if (this.config.responseMapping.success) {
      mapped.success = this.getNestedValue(data, this.config.responseMapping.success)
    }
    
    if (this.config.responseMapping.data) {
      mapped.data = this.getNestedValue(data, this.config.responseMapping.data)
    }
    
    if (this.config.responseMapping.error) {
      mapped.error = this.getNestedValue(data, this.config.responseMapping.error)
    }

    return mapped
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest()
      return true
    } catch (error) {
      console.error('Custom integration connection test failed:', error)
      return false
    }
  }

  async validateEndpoint(): Promise<{
    valid: boolean
    status?: number
    error?: string
  }> {
    try {
      const result = await this.makeRequest()
      return {
        valid: true,
        status: result.status
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
