"use client"

import { useState, useEffect } from "react"
import { 
  ArrowRight, 
  Check, 
  Layers, 
  Link, 
  Zap, 
  AlertCircle, 
  ExternalLink,
  FileText,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Download,
  Share2,
  Eye,
  Brain,
  Sparkles,
  Clock,
  DollarSign,
  Shield,
  Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/ui/app-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FigmaFile {
  id: string
  name: string
  lastModified: string
  thumbnailUrl: string
  version: string
}

interface AnalysisResult {
  insights: any[]
  recommendations: any[]
  accessibility: any
  conversion: any
  competitive: any
  score: number
}

interface StrategicReport {
  executive: any
  detailed: any
  technical: any
  accessibility: any
  conversion: any
}

export default function FigmaSetupPage() {
  const [step, setStep] = useState(1)
  const [figmaUrl, setFigmaUrl] = useState("")
  const [figmaAccessToken, setFigmaAccessToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [figmaFiles, setFigmaFiles] = useState<FigmaFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [strategicReport, setStrategicReport] = useState<StrategicReport | null>(null)
  const [stakeholderRole, setStakeholderRole] = useState("executive")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  
  const { toast } = useToast()

  // Extract Figma file ID from URL
  const extractFigmaFileId = (url: string) => {
    const match = url.match(/file\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  const handleConnect = async () => {
    if (!figmaUrl && !figmaAccessToken) {
      toast({
        title: "Missing Information",
        description: "Please provide either a Figma file URL or access token",
        variant: "destructive"
      })
      return
    }

    setIsConnecting(true)
    
    try {
      let fileId = extractFigmaFileId(figmaUrl)
      
      if (!fileId && figmaAccessToken) {
        // Use access token to get user's files
        const response = await fetch('/api/integrations/figma/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: figmaAccessToken })
        })
        
        if (response.ok) {
          const data = await response.json()
          setFigmaFiles(data.files)
          setStep(2)
        } else {
          throw new Error('Failed to fetch Figma files')
        }
      } else if (fileId) {
        // Direct file analysis
        setStep(2)
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Figma. Please check your credentials.",
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleFileSelection = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles(prev => [...prev, fileId])
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId))
    }
  }

  const startAnalysis = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to analyze",
        variant: "destructive"
      })
      return
    }

    setStep(3)
    setAnalysisProgress(0)
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 1000)

    try {
      // Start real analysis
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          figmaFiles: selectedFiles,
          accessToken: figmaAccessToken
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result.analysis)
        setStrategicReport(result.report)
        setStep(4)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  const generateStrategicReport = async () => {
    setIsGeneratingReport(true)
    
    try {
      const response = await fetch('/api/analysis/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId: analysisResult?.id,
          reportType: stakeholderRole,
          includeDeck: true
        })
      })

      if (response.ok) {
        const report = await response.json()
        setStrategicReport(report)
        toast({
          title: "Report Generated",
          description: "Your strategic report is ready!",
        })
      }
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const downloadReport = (format: 'pdf' | 'pptx' | 'docx') => {
    // Implementation for downloading reports
    toast({
      title: "Download Started",
      description: `Downloading ${format.toUpperCase()} report...`,
    })
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader 
        title="UXplain v2.0 - AI-Native UX Strategy"
        showBackButton={true}
        onBackClick={() => (window.location.href = "/dashboard")}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {i === 1 && <Brain className="w-5 h-5" />}
                  {i === 2 && <Layers className="w-5 h-5" />}
                  {i === 3 && <Zap className="w-5 h-5" />}
                  {i === 4 && <Target className="w-5 h-5" />}
                </div>
                {i < 4 && <div className={`w-20 h-1 mx-2 ${step > i ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-slate-600">
              Step {step} of 4: {
                step === 1 ? "Connect & Configure" : 
                step === 2 ? "Select Design Files" : 
                step === 3 ? "AI Analysis in Progress" : 
                "Strategic Insights Ready"
              }
            </div>
          </div>
        </div>

        {/* Step 1: Connect & Configure */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Welcome to UXplain v2.0
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Your AI-native UX strategy agent that transforms design files into boardroom-ready strategic insights
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Figma Connection */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <span>Connect Figma</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="figmaUrl" className="text-base font-medium">
                      Figma File URL (Optional)
                    </Label>
                    <p className="text-sm text-slate-500 mb-3">Paste a specific Figma file URL for direct analysis</p>
                    <Input
                      id="figmaUrl"
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                      placeholder="https://www.figma.com/file/..."
                      className="text-base"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Or</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="figmaToken" className="text-base font-medium">
                      Figma Access Token
                    </Label>
                    <p className="text-sm text-slate-500 mb-3">For accessing multiple files and team projects</p>
                    <Input
                      id="figmaToken"
                      type="password"
                      value={figmaAccessToken}
                      onChange={(e) => setFigmaAccessToken(e.target.value)}
                      placeholder="Enter your Figma access token"
                      className="text-base"
                    />
                    <a 
                      href="https://www.figma.com/developers/api#access-tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center"
                    >
                      How to get access token <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Project Configuration */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-pink-600" />
                    <span>Project Setup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="projectName" className="text-base font-medium">
                      Project Name
                    </Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="E.g., E-commerce Redesign 2024"
                      className="text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectDescription" className="text-base font-medium">
                      Project Description
                    </Label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Brief description of your project goals and context..."
                      rows={3}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stakeholderRole" className="text-base font-medium">
                      Primary Stakeholder Role
                    </Label>
                    <Select value={stakeholderRole} onValueChange={setStakeholderRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Executive/Board</SelectItem>
                        <SelectItem value="product">Product Manager</SelectItem>
                        <SelectItem value="designer">UX Designer</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-4 px-8"
                onClick={handleConnect}
                disabled={(!figmaUrl && !figmaAccessToken) || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connecting to Figma...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start UX Strategy Analysis
                  </>
                )}
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-900 mb-2">AI-Native Analysis</h3>
                  <p className="text-sm text-blue-700">Advanced AI that understands UX patterns, accessibility, and conversion optimization</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-emerald-900 mb-2">Strategic Insights</h3>
                  <p className="text-sm text-emerald-700">Boardroom-ready recommendations with revenue impact predictions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-amber-900 mb-2">Auto-Deck Generation</h3>
                  <p className="text-sm text-amber-700">Automatically create presentations for stakeholders and team reviews</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Select Design Files */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Layers className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Select Design Files to Analyze</h1>
              <p className="text-lg text-slate-600">Choose which Figma files and pages you'd like our AI to analyze for strategic insights</p>
            </div>

            {figmaFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {figmaFiles.map((file) => (
                  <Card 
                    key={file.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedFiles.includes(file.id) 
                        ? 'border-purple-300 bg-purple-50 shadow-lg' 
                        : 'border-slate-200 hover:border-purple-200'
                    }`}
                    onClick={() => handleFileSelection(file.id, !selectedFiles.includes(file.id))}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Layers className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{file.name}</h3>
                            <p className="text-sm text-slate-500">v{file.version}</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => {}} // Controlled by parent click
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Modified: {new Date(file.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span>File ID: {file.id.slice(0, 8)}...</span>
                        </div>
                      </div>

                      {selectedFiles.includes(file.id) && (
                        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                          <div className="flex items-center space-x-2 text-purple-700">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Selected for analysis</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto bg-white">
                <CardContent className="p-8 text-center">
                  <Layers className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Files Found</h3>
                  <p className="text-slate-600 mb-4">
                    We couldn't find any Figma files. Please check your access token or provide a direct file URL.
                  </p>
                  <Button onClick={() => setStep(1)} variant="outline">
                    Go Back to Setup
                  </Button>
                </CardContent>
              </Card>
            )}

            {figmaFiles.length > 0 && (
              <div className="text-center space-y-4">
                <div className="text-sm text-slate-600">
                  {selectedFiles.length} of {figmaFiles.length} files selected
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                  onClick={startAnalysis}
                  disabled={selectedFiles.length === 0}
                >
                  Start AI Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: AI Analysis in Progress */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">AI Analysis in Progress</h1>
              <p className="text-lg text-slate-600">
                Our AI is analyzing your designs for strategic insights, accessibility compliance, and conversion opportunities
              </p>
            </div>

            <Card className="max-w-3xl mx-auto bg-white">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-slate-700">Analysis Progress</span>
                      <span className="text-lg font-medium text-slate-700">{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-4" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Design files imported and parsed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Component hierarchy analyzed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {analysisProgress > 30 ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-indigo-600 rounded-full animate-spin"></div>
                      )}
                      <span className="text-slate-700">UX patterns being evaluated...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {analysisProgress > 60 ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
                      )}
                      <span className="text-slate-400">Accessibility compliance check</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {analysisProgress > 80 ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
                      )}
                      <span className="text-slate-400">Conversion optimization analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {analysisProgress >= 100 ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
                      )}
                      <span className="text-slate-400">Generating strategic recommendations</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-6 h-6 text-indigo-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-1">What's happening?</h4>
                        <p className="text-sm text-indigo-700">
                          Our AI is analyzing your designs against 10,000+ UX patterns, accessibility standards, 
                          and conversion optimization best practices to generate strategic insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                Estimated completion time: {Math.max(0, Math.round((100 - analysisProgress) / 15))} seconds remaining
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Strategic Insights Ready */}
        {step === 4 && analysisResult && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Strategic Insights Ready!</h1>
              <p className="text-lg text-slate-600">
                Your AI-powered UX analysis is complete. Here are the strategic insights and recommendations.
              </p>
            </div>

            {/* Overall Score */}
            <Card className="max-w-2xl mx-auto bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {analysisResult.score}/100
                  </div>
                  <p className="text-lg text-slate-600">Overall UX Strategy Score</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{analysisResult.accessibility?.score || 0}</div>
                    <p className="text-sm text-slate-600">Accessibility</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.conversion?.score || 0}</div>
                    <p className="text-sm text-slate-600">Conversion</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Insights Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Key Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="conversion">Conversion</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                        <span>Top Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.insights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              insight.type === 'positive' ? 'bg-emerald-500' : 
                              insight.type === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <p className="font-medium text-slate-900">{insight.title}</p>
                              <p className="text-sm text-slate-600">{insight.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span>Priority Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.recommendations
                          .filter(r => r.priority === 'critical' || r.priority === 'high')
                          .slice(0, 3)
                          .map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Badge variant={rec.priority === 'critical' ? 'destructive' : 'default'}>
                              {rec.priority}
                            </Badge>
                            <div>
                              <p className="font-medium text-slate-900">{rec.title}</p>
                              <p className="text-sm text-slate-600">{rec.estimatedImpact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analysisResult.insights.map((insight, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                insight.type === 'positive' ? 'default' : 
                                insight.type === 'negative' ? 'destructive' : 'secondary'
                              }>
                                {insight.type}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                            </div>
                            <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-2">{insight.title}</h4>
                          <p className="text-slate-700 mb-3">{insight.description}</p>
                          {insight.evidence && insight.evidence.length > 0 && (
                            <div className="text-sm text-slate-600">
                              <strong>Evidence:</strong> {insight.evidence.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                rec.priority === 'critical' ? 'destructive' : 
                                rec.priority === 'high' ? 'default' : 
                                rec.priority === 'medium' ? 'secondary' : 'outline'
                              }>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">{rec.category}</Badge>
                            </div>
                            <Badge variant="outline">{rec.effort} effort</Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-2">{rec.title}</h4>
                          <p className="text-slate-700 mb-3">{rec.description}</p>
                          <div className="space-y-2 text-sm">
                            <div><strong>Implementation:</strong> {rec.implementation}</div>
                            <div><strong>Expected Impact:</strong> {rec.estimatedImpact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {analysisResult.accessibility?.score || 0}/100
                      </div>
                      <p className="text-slate-600">Accessibility Score</p>
                    </div>
                    
                    {analysisResult.accessibility?.issues && analysisResult.accessibility.issues.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Issues Found</h4>
                        {analysisResult.accessibility.issues.map((issue, index) => (
                          <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="destructive">{issue.severity}</Badge>
                              <Badge variant="outline">{issue.type}</Badge>
                            </div>
                            <p className="font-medium text-slate-900 mb-1">{issue.description}</p>
                            <p className="text-sm text-slate-600"><strong>Element:</strong> {issue.element}</p>
                            <p className="text-sm text-slate-600"><strong>Fix:</strong> {issue.fix}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conversion" className="space-y-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {analysisResult.conversion?.score || 0}/100
                      </div>
                      <p className="text-slate-600">Conversion Optimization Score</p>
                    </div>
                    
                    {analysisResult.conversion?.opportunities && analysisResult.conversion.opportunities.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Optimization Opportunities</h4>
                        {analysisResult.conversion.opportunities.map((opp, index) => (
                          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                            <p className="font-medium text-slate-900 mb-1">{opp.element}</p>
                            <p className="text-sm text-slate-600 mb-2"><strong>Current:</strong> {opp.currentState}</p>
                            <p className="text-sm text-slate-600 mb-2"><strong>Suggested:</strong> {opp.suggestedChange}</p>
                            <p className="text-sm text-slate-600"><strong>Expected Improvement:</strong> {opp.expectedImprovement}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                  onClick={generateStrategicReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Strategic Report
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {strategicReport && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => downloadReport('pdf')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadReport('pptx')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PowerPoint</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadReport('docx')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Word</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
