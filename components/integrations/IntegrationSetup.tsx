'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Copy,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

interface IntegrationConfig {
  type: string
  name: string
  config: Record<string, any>
}

interface IntegrationSetupProps {
  onIntegrationCreated: (integration: IntegrationConfig) => void
  onCancel: () => void
}

const INTEGRATION_TYPES = [
  { 
    value: 'GOOGLE_ANALYTICS', 
    label: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    icon: '📊',
    fields: [
      { key: 'propertyId', label: 'Property ID', type: 'text', required: true, placeholder: 'G-XXXXXXXXXX' },
      { key: 'clientEmail', label: 'Service Account Email', type: 'email', required: true, placeholder: 'service@project.iam.gserviceaccount.com' },
      { key: 'privateKey', label: 'Private Key', type: 'textarea', required: true, placeholder: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----' },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, placeholder: '123456789-xxx.apps.googleusercontent.com' }
    ],
    helpUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries'
  },
  { 
    value: 'HOTJAR', 
    label: 'Hotjar',
    description: 'Heatmaps, recordings, and user feedback',
    icon: '🔥',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      { key: 'siteId', label: 'Site ID', type: 'text', required: true, placeholder: '1234567' }
    ],
    helpUrl: 'https://help.hotjar.com/hc/en-us/articles/115009336727-How-to-get-your-Hotjar-API-key'
  },
  { 
    value: 'POWERBI', 
    label: 'Power BI',
    description: 'Business intelligence and data analytics',
    icon: '💼',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, placeholder: '12345678-1234-1234-1234-123456789012' },
      { key: 'clientSecret', label: 'Client Secret', type: 'text', required: true, placeholder: 'your-client-secret' },
      { key: 'tenantId', label: 'Tenant ID', type: 'text', required: true, placeholder: '12345678-1234-1234-1234-123456789012' },
      { key: 'workspaceId', label: 'Workspace ID', type: 'text', required: false, placeholder: 'Optional workspace ID' }
    ],
    helpUrl: 'https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal'
  },
  { 
    value: 'MIXPANEL', 
    label: 'Mixpanel',
    description: 'Product analytics and user behavior tracking',
    icon: '📈',
    fields: [
      { key: 'apiSecret', label: 'API Secret', type: 'text', required: true, placeholder: 'your-api-secret' },
      { key: 'projectId', label: 'Project ID', type: 'text', required: true, placeholder: '123456' }
    ],
    helpUrl: 'https://developer.mixpanel.com/docs/authentication'
  },
  { 
    value: 'AMPLITUDE', 
    label: 'Amplitude',
    description: 'Product analytics and user insights',
    icon: '📊',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'your-api-key' },
      { key: 'secretKey', label: 'Secret Key', type: 'text', required: true, placeholder: 'your-secret-key' }
    ],
    helpUrl: 'https://www.docs.developers.amplitude.com/analytics/apis/dashboard-rest-api/'
  },
  { 
    value: 'CUSTOM', 
    label: 'Custom Integration',
    description: 'Connect to any API or service',
    icon: '🔧',
    fields: [
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: true, placeholder: 'https://api.example.com' },
      { key: 'apiKey', label: 'API Key', type: 'text', required: false, placeholder: 'Optional API key' },
      { key: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', required: false, placeholder: '{"Authorization": "Bearer token"}' },
      { key: 'endpoints', label: 'Endpoints (JSON)', type: 'textarea', required: true, placeholder: '{"users": "/users", "data": "/data"}' }
    ],
    helpUrl: null
  }
]

export default function IntegrationSetup({ onIntegrationCreated, onCancel }: IntegrationSetupProps) {
  const [selectedType, setSelectedType] = useState('')
  const [integrationName, setIntegrationName] = useState('')
  const [config, setConfig] = useState<Record<string, any>>({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null)

  const selectedIntegration = INTEGRATION_TYPES.find(t => t.value === selectedType)

  useEffect(() => {
    if (selectedType) {
      // Initialize config with empty values
      const initialConfig: Record<string, any> = {}
      selectedIntegration?.fields.forEach(field => {
        initialConfig[field.key] = ''
      })
      setConfig(initialConfig)
      setShowSecrets({})
    }
  }, [selectedType])

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const validateConfig = async () => {
    if (!selectedType || !integrationName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      const response = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          config: config
        })
      })

      const result = await response.json()

      if (response.ok) {
        setValidationResult({
          success: true,
          message: 'Integration test successful! Connection verified.'
        })
        toast.success('Integration test successful!')
      } else {
        setValidationResult({
          success: false,
          message: result.error || 'Integration test failed'
        })
        toast.error('Integration test failed')
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: 'Failed to test integration. Please check your configuration.'
      })
      toast.error('Failed to test integration')
    } finally {
      setIsValidating(false)
    }
  }

  const createIntegration = async () => {
    if (!selectedType || !integrationName) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          name: integrationName,
          config: config
        })
      })

      if (response.ok) {
        toast.success('Integration created successfully!')
        onIntegrationCreated({
          type: selectedType,
          name: integrationName,
          config: config
        })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create integration')
      }
    } catch (error) {
      toast.error('Failed to create integration')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadConfigTemplate = () => {
    if (!selectedIntegration) return

    const template = {
      integration: selectedIntegration.label,
      description: selectedIntegration.description,
      fields: selectedIntegration.fields.map(field => ({
        key: field.key,
        label: field.label,
        required: field.required,
        placeholder: field.placeholder
      })),
      helpUrl: selectedIntegration.helpUrl
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedIntegration.value.toLowerCase()}-config-template.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Setup New Integration</span>
          </CardTitle>
          <CardDescription>
            Configure your integration with the required API keys and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Integration Type Selection */}
          <div className="space-y-4">
            <Label htmlFor="integration-type">Integration Type *</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select integration type" />
              </SelectTrigger>
              <SelectContent>
                {INTEGRATION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integration Name */}
          <div className="space-y-4">
            <Label htmlFor="integration-name">Integration Name *</Label>
            <Input
              id="integration-name"
              placeholder="My Google Analytics"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
            />
          </div>

          {/* Configuration Fields */}
          {selectedIntegration && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Configuration</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadConfigTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                  {selectedIntegration.helpUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedIntegration.helpUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {selectedIntegration.fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.key}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'text' && field.key.includes('key') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(field.key)}
                        >
                          {showSecrets[field.key] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {field.type === 'text' && (
                      <div className="relative">
                        <Input
                          id={field.key}
                          type={field.key.includes('key') && !showSecrets[field.key] ? 'password' : 'text'}
                          placeholder={field.placeholder}
                          value={config[field.key] || ''}
                          onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        />
                        {field.key.includes('key') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-2"
                            onClick={() => copyToClipboard(config[field.key] || '')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}

                    {field.type === 'textarea' && (
                      <Textarea
                        id={field.key}
                        placeholder={field.placeholder}
                        value={config[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        rows={4}
                      />
                    )}

                    {field.type === 'email' && (
                      <Input
                        id={field.key}
                        type="email"
                        placeholder={field.placeholder}
                        value={config[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Result */}
          {validationResult && (
            <Alert className={validationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {validationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={validationResult.success ? 'text-green-800' : 'text-red-800'}>
                {validationResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={validateConfig}
                disabled={isValidating || !selectedType || !integrationName}
              >
                {isValidating ? 'Testing...' : 'Test Connection'}
              </Button>
              
              <Button
                onClick={createIntegration}
                disabled={!selectedType || !integrationName || !validationResult?.success}
              >
                Create Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Information */}
      {selectedIntegration && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">About {selectedIntegration.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {selectedIntegration.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Required Fields:</span>
                <Badge variant="secondary">
                  {selectedIntegration.fields.filter(f => f.required).length} required
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Optional Fields:</span>
                <Badge variant="outline">
                  {selectedIntegration.fields.filter(f => !f.required).length} optional
                </Badge>
              </div>
            </div>

            {selectedIntegration.helpUrl && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => window.open(selectedIntegration.helpUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
