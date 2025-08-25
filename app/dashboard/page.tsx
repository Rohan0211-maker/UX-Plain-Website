"use client"

import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Plus,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Activity,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Brain,
  ArrowRight,
  Layers,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Lightbulb,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/ui/app-header"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <AppHeader 
        title="UXplain Revenue Dashboard"
        rightContent={
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "overview" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Revenue Impact
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "ux-suggestions" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("ux-suggestions")}
              >
                UX Suggestions
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "reports" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("reports")}
              >
                Revenue Reports
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "integrations"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("integrations")}
              >
                Data Sources
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Ask about UX revenue impact..." className="pl-10 w-64 bg-white/80 border-slate-200 backdrop-blur-sm" />
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-white/80">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-white/80">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">UX</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        }
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    New UX Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-slate-50">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>

              {/* Recent UX Projects */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Recent UX Projects</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 cursor-pointer transition-all duration-300 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Checkout Flow Redesign</p>
                        <p className="text-xs text-slate-500">+$47K revenue impact</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">+23%</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 cursor-pointer transition-all duration-300 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Mobile Navigation</p>
                        <p className="text-xs text-slate-500">+$18K revenue impact</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">+15%</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Impact Summary */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Total Revenue Impact</h3>
                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">$127K</p>
                    <p className="text-xs text-slate-600">Generated from UX improvements</p>
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">+34% YoY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  UX Revenue Impact Dashboard
                </h1>
                <p className="text-slate-600 text-lg">See how your UX changes directly impact revenue and business metrics.</p>
              </div>

              {/* Revenue Impact Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Revenue Impact</p>
                        <p className="text-2xl font-bold text-emerald-600">$127K</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">+34% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-blue-600">4.8%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <ArrowUpRight className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm text-blue-600">+0.8% improvement</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">UX Issues Fixed</p>
                        <p className="text-2xl font-bold text-amber-600">47</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="text-sm text-slate-600">$2.7K avg. impact per fix</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">ROI on UX</p>
                        <p className="text-2xl font-bold text-purple-600">312%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="text-sm text-slate-600">For every $1 invested</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* UX Revenue Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-900">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Recent UX Revenue Wins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Checkout flow optimization</p>
                          <p className="text-xs text-slate-500">Reduced cart abandonment by 23%</p>
                          <p className="text-xs text-emerald-600 font-medium">+$47K revenue impact</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Mobile navigation redesign</p>
                          <p className="text-xs text-slate-500">Improved mobile conversion by 15%</p>
                          <p className="text-xs text-blue-600 font-medium">+$18K revenue impact</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Pricing page clarity</p>
                          <p className="text-xs text-slate-500">Increased premium plan adoption by 18%</p>
                          <p className="text-xs text-purple-600 font-medium">+$32K revenue impact</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-900">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      AI Revenue Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 mb-1">High-Impact Opportunity</p>
                            <p className="text-sm text-slate-600 mb-2">
                              Adding social proof to product pages could increase conversions by 28%
                            </p>
                            <p className="text-sm text-blue-600 font-medium">Potential: +$89K revenue</p>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-2">
                              View Analysis
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 mb-1">Quick Win Alert</p>
                            <p className="text-sm text-slate-600">
                              Simplifying the signup form could boost conversions by 19%
                            </p>
                            <p className="text-sm text-emerald-600 font-medium">Potential: +$34K revenue</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "ux-suggestions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  AI-Powered UX Suggestions
                </h1>
                <p className="text-slate-600 text-lg">Get intelligent recommendations to improve UX and boost revenue.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-red-100 text-red-700">High Priority</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Checkout Form Optimization</h3>
                    <p className="text-sm text-slate-600 mb-4">Reduce form fields and improve mobile experience</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current Conversion:</span>
                        <span className="text-red-600">2.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Predicted:</span>
                        <span className="text-emerald-600">3.8%</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600">Revenue Impact:</span>
                        <span className="text-emerald-600">+$67K</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                      Implement Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">Medium Priority</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Social Proof Integration</h3>
                    <p className="text-sm text-slate-600 mb-4">Add customer testimonials and trust badges</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current Conversion:</span>
                        <span className="text-amber-600">3.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Predicted:</span>
                        <span className="text-emerald-600">4.1%</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600">Revenue Impact:</span>
                        <span className="text-emerald-600">+$28K</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Low Priority</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Mobile Navigation</h3>
                    <p className="text-sm text-slate-600 mb-4">Improve mobile menu and search experience</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current Conversion:</span>
                        <span className="text-blue-600">1.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Predicted:</span>
                        <span className="text-emerald-600">2.3%</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600">Revenue Impact:</span>
                        <span className="text-emerald-600">+$15K</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Schedule for Later
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Revenue Reports & Analytics
                </h1>
                <p className="text-slate-600 text-lg">Generate comprehensive reports showing UX impact on business metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Ready</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Monthly Revenue Report</h3>
                    <p className="text-sm text-slate-600 mb-4">Comprehensive analysis of UX impact on revenue</p>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Ready</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">ROI Analysis Report</h3>
                    <p className="text-sm text-slate-600 mb-4">Return on investment for UX improvements</p>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <LineChart className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">Ready</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Trend Analysis Report</h3>
                    <p className="text-sm text-slate-600 mb-4">Long-term UX impact trends and predictions</p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Data Sources & Integrations
                </h1>
                <p className="text-slate-600 text-lg">Connect your data sources to get comprehensive UX revenue insights.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-purple-200 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Figma</h3>
                    <p className="text-sm text-slate-600 mb-4">Design files, prototypes, component analysis</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-purple-50">
                      Configure
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Google Analytics 4</h3>
                    <p className="text-sm text-slate-600 mb-4">User behavior, conversion tracking, goal completions</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-blue-50">
                      Configure
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Hotjar</h3>
                    <p className="text-sm text-slate-600 mb-4">Heatmaps, session recordings, user feedback</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-orange-50">
                      Configure
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-slate-100 text-slate-700">Not Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">PowerBI</h3>
                    <p className="text-sm text-slate-600 mb-4">Business intelligence, custom dashboards</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-slate-100 text-slate-700">Not Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Customer Feedback</h3>
                    <p className="text-sm text-slate-600 mb-4">Support tickets, reviews, complaint data</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-slate-100 text-slate-700">Not Connected</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Mixpanel</h3>
                    <p className="text-sm text-slate-600 mb-4">Product analytics and user events</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
