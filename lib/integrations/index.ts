export { GoogleAnalyticsService, type GoogleAnalyticsConfig, type AnalyticsData } from './google-analytics'
export { HotjarService, type HotjarConfig, type HotjarData } from './hotjar'
export { PowerBIService, type PowerBIConfig, type PowerBIData } from './powerbi'
export { MixpanelService, type MixpanelConfig, type MixpanelData } from './mixpanel'
export { AmplitudeService, type AmplitudeConfig, type AmplitudeData } from './amplitude'
export { CustomIntegrationService, type CustomIntegrationConfig, type CustomIntegrationData } from './custom'

// Integration factory function
export function createIntegrationService(type: string, config: any) {
  switch (type) {
    case 'GOOGLE_ANALYTICS':
      return new GoogleAnalyticsService(config)
    case 'HOTJAR':
      return new HotjarService(config)
    case 'POWERBI':
      return new PowerBIService(config)
    case 'MIXPANEL':
      return new MixpanelService(config)
    case 'AMPLITUDE':
      return new AmplitudeService(config)
    case 'CUSTOM':
      return new CustomIntegrationService(config)
    default:
      throw new Error(`Unsupported integration type: ${type}`)
  }
}
