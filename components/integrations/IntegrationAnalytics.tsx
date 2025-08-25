'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  Calendar,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
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

interface IntegrationAnalyticsProps {
  integrationId: string
  integrationType: string
  integrationName: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function IntegrationAnalytics({ 
  integrationId, 
  integrationType, 
  integrationName 
}: IntegrationAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('7d')
  const [chartType, setChartType] = useState('bar')

  useEffect(() => {
    fetchAnalyticsData()
  }, [integrationId, dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/integrations/${integrationId}/analytics?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '1d': return 'Last 24 hours'
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      default: return 'Last 7 days'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Analytics for {integrationName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Analytics for {integrationName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No analytics data available for this integration.
            </p>
            <Button onClick={fetchAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Analytics for {integrationName}</span>
            </CardTitle>
            <CardDescription>
              {getDateRangeLabel(dateRange)} • {integrationType}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Eye className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Page Views</p>
              <p className="text-2xl font-bold">{formatNumber(analyticsData.pageViews)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
              <p className="text-2xl font-bold">{formatNumber(analyticsData.uniqueUsers)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Activity className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{formatNumber(analyticsData.sessions)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">{formatDuration(analyticsData.avgSessionDuration)}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium mb-4">Top Pages by Page Views</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pagePath" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pageViews" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Top Traffic Sources</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="line" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium mb-4">Page Views Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pagePath" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pageViews" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Sessions Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.topSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pie" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-lg font-medium mb-4">Page Views Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.topPages}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ pagePath, pageViews }) => `${pagePath}: ${pageViews}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="pageViews"
                    >
                      {analyticsData.topPages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Traffic Sources Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.topSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, sessions }) => `${source}: ${sessions}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sessions"
                    >
                      {analyticsData.topSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">
                  {analyticsData.bounceRate.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {analyticsData.bounceRate > 70 ? 'High bounce rate detected' : 'Good engagement'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {formatDuration(analyticsData.avgSessionDuration)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Average time per session
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
