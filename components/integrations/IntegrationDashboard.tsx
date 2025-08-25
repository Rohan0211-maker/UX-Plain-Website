'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Logo } from '@/components/ui/logo'
import { 
  Plus, 
  Settings, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Database,
  Activity,
  History,
  BarChart3,
  Calendar,
  Zap,
  Eye,
  Download,
  Key
} from 'lucide-react'
import { toast } from 'sonner'
import IntegrationSetup from './IntegrationSetup'

interface Integration {
  id: string
  type: string
  name: string
  status: string
  lastSync?: string
  createdAt: string
  updatedAt: string
  config: string
}

interface IntegrationStats {
  total: number
  active: number
  error: number
  syncing: number
}

interface IntegrationLog {
  id: string
  type: string
  message: string
  data?: string
  timestamp: string
}

interface SyncProgress {
  [key: string]: {
    progress: number
    status: string
    message: string
  }
}

export default function IntegrationDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [stats, setStats] = useState<IntegrationStats>({ total: 0, active: 0, error: 0, syncing: 0 })
  const [loading, setLoading] = useState(true)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([])
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({})
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchIntegrations()
    
    if (autoRefresh) {
      const interval = setInterval(fetchIntegrations, 10000) // Refresh every 10 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/integrations')
      if (response.ok) {
        const data = await response.json()
        setIntegrations(data.integrations)
        calculateStats(data.integrations)
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
      toast.error('Failed to fetch integrations')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (integrations: Integration[]) => {
    const stats = {
      total: integrations.length,
      active: integrations.filter(i => i.status === 'ACTIVE').length,
      error: integrations.filter(i => i.status === 'ERROR').length,
      syncing: integrations.filter(i => i.status === 'SYNCING').length
    }
    setStats(stats)
  }

  const handleIntegrationCreated = (integration: { type: string; name: string; config: Record<string, any> }) => {
    setShowSetupDialog(false)
    fetchIntegrations()
  }

  const testIntegration = async (integration: Integration) => {
    try {
      const config = JSON.parse(integration.config)
      const response = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: integration.type,
          config
        })
      })

      if (response.ok) {
        toast.success('Integration test successful')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Integration test failed')
      }
    } catch (error) {
      console.error('Integration test failed:', error)
      toast.error('Integration test failed')
    }
  }

  const syncIntegration = async (integration: Integration) => {
    try {
      // Set initial sync progress
      setSyncProgress(prev => ({
        ...prev,
        [integration.id]: {
          progress: 0,
          status: 'Starting sync...',
          message: 'Initializing integration sync'
        }
      }))

      const response = await fetch(`/api/integrations/${integration.id}/sync`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Integration sync started')
        
        // Start monitoring sync progress
        monitorSyncProgress(integration.id)
        fetchIntegrations()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to start sync')
        
        // Clear sync progress on error
        setSyncProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[integration.id]
          return newProgress
        })
      }
    } catch (error) {
      console.error('Failed to start sync:', error)
      toast.error('Failed to start sync')
      
      // Clear sync progress on error
      setSyncProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[integration.id]
        return newProgress
      })
    }
  }

  const monitorSyncProgress = useCallback(async (integrationId: string) => {
    const checkProgress = async () => {
      try {
        const response = await fetch(`/api/integrations/${integrationId}/sync`)
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'SYNCING') {
            // Update progress
            setSyncProgress(prev => ({
              ...prev,
              [integrationId]: {
                progress: Math.min(prev[integrationId]?.progress + 10, 90),
                status: 'Syncing...',
                message: 'Fetching data from integration'
              }
            }))
            
            // Continue monitoring
            setTimeout(checkProgress, 2000)
          } else if (data.status === 'ACTIVE') {
            // Sync completed
            setSyncProgress(prev => ({
              ...prev,
              [integrationId]: {
                progress: 100,
                status: 'Completed',
                message: 'Sync completed successfully'
              }
            }))
            
            // Clear progress after delay
            setTimeout(() => {
              setSyncProgress(prev => {
                const newProgress = { ...prev }
                delete newProgress[integrationId]
                return newProgress
              })
            }, 3000)
            
            fetchIntegrations()
          } else if (data.status === 'ERROR') {
            // Sync failed
            setSyncProgress(prev => ({
              ...prev,
              [integrationId]: {
                progress: 0,
                status: 'Failed',
                message: 'Sync failed with error'
              }
            }))
            
            // Clear progress after delay
            setTimeout(() => {
              setSyncProgress(prev => {
                const newProgress = { ...prev }
                delete newProgress[integrationId]
                return newProgress
              })
            }, 5000)
          }
        }
      } catch (error) {
        console.error('Failed to check sync progress:', error)
      }
    }
    
    checkProgress()
  }, [])

  const deleteIntegration = async (integration: Integration) => {
    if (!confirm(`Are you sure you want to delete ${integration.name}?`)) return

    try {
      const response = await fetch(`/api/integrations/${integration.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Integration deleted successfully')
        fetchIntegrations()
      } else {
        toast.error('Failed to delete integration')
      }
    } catch (error) {
      console.error('Failed to delete integration:', error)
      toast.error('Failed to delete integration')
    }
  }

  const fetchIntegrationLogs = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/webhook?integrationId=${integrationId}&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setIntegrationLogs(data.logs)
      }
    } catch (error) {
      console.error('Failed to fetch integration logs:', error)
      toast.error('Failed to fetch integration logs')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'SYNCING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'INACTIVE':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'ACTIVE': 'default',
      'ERROR': 'destructive',
      'SYNCING': 'secondary',
      'INACTIVE': 'outline'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'GOOGLE_ANALYTICS':
        return <Database className="h-5 w-5" />
      case 'HOTJAR':
        return <Activity className="h-5 w-5" />
      case 'POWERBI':
        return <Database className="h-5 w-5" />
      case 'MIXPANEL':
        return <Activity className="h-5 w-5" />
      case 'AMPLITUDE':
        return <Activity className="h-5 w-5" />
      case 'CUSTOM':
        return <ExternalLink className="h-5 w-5" />
      default:
        return <Database className="h-5 w-5" />
    }
  }

  const exportIntegrationData = async (integration: Integration) => {
    try {
      const response = await fetch(`/api/integrations/${integration.id}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${integration.name}-data.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Data exported successfully')
      }
    } catch (error) {
      console.error('Failed to export data:', error)
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo variant="full" size="lg" />
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-3xl font-bold">Integrations</h1>
          </div>
          <Button disabled>Loading...</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo variant="full" size="lg" />
          <div className="h-8 w-px bg-border"></div>
          <h1 className="text-3xl font-bold">Integrations</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Zap className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-blue-600' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={() => setShowSetupDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.error}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syncing</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncing}</div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Integrations</CardTitle>
          <CardDescription>
            Manage and monitor your data integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrations.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No integrations yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first integration to connect your data sources.
              </p>
              <Button onClick={() => setShowSetupDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="border rounded-lg">
                  {/* Integration Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.status)}
                        {getStatusBadge(integration.status)}
                      </div>
                      
                      {integration.lastSync && (
                        <div className="text-sm text-muted-foreground">
                          Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testIntegration(integration)}
                        >
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncIntegration(integration)}
                          disabled={integration.status === 'SYNCING'}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIntegration(integration)
                            fetchIntegrationLogs(integration.id)
                            setShowLogsDialog(true)
                          }}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportIntegrationData(integration)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIntegration(integration)
                            setShowConfigDialog(true)
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteIntegration(integration)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sync Progress */}
                  {syncProgress[integration.id] && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {syncProgress[integration.id].status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {syncProgress[integration.id].progress}%
                        </span>
                      </div>
                      <Progress value={syncProgress[integration.id].progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {syncProgress[integration.id].message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>



      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Integration Configuration</DialogTitle>
            <DialogDescription>
              View and edit integration settings
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={selectedIntegration.name} readOnly />
              </div>
              
              <div>
                <Label>Type</Label>
                <Input value={selectedIntegration.type} readOnly />
              </div>
              
              <div>
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedIntegration.status)}
                  {getStatusBadge(selectedIntegration.status)}
                </div>
              </div>
              
              <div>
                <Label>Configuration</Label>
                <Textarea
                  value={JSON.stringify(JSON.parse(selectedIntegration.config), null, 2)}
                  readOnly
                  rows={8}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Integration Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Integration Logs</DialogTitle>
            <DialogDescription>
              View recent activity and logs for {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {integrationLogs.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No logs found for this integration</p>
              </div>
            ) : (
              <div className="space-y-3">
                {integrationLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {log.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      {log.type === 'data_update' && <Database className="h-4 w-4 text-blue-500" />}
                      {log.type === 'status_change' && <RefreshCw className="h-4 w-4 text-yellow-500" />}
                      {log.type === 'sync_complete' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            View Data
                          </summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(JSON.parse(log.data), null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowLogsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Integration Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Setup New Integration</span>
            </DialogTitle>
            <DialogDescription>
              Configure your integration with the required API keys and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-y-auto">
            <IntegrationSetup
              onIntegrationCreated={handleIntegrationCreated}
              onCancel={() => setShowSetupDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
