import OpenAI from "openai"
import { prisma } from "./prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AnalysisResult {
  insights: UXInsight[]
  recommendations: UXRecommendation[]
  accessibility: AccessibilityReport
  conversion: ConversionAnalysis
  competitive: CompetitiveAnalysis
  score: number
}

export interface UXInsight {
  id: string
  type: "positive" | "negative" | "neutral"
  category: "layout" | "navigation" | "accessibility" | "conversion" | "mobile" | "performance"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  evidence: string[]
  element?: string
}

export interface UXRecommendation {
  id: string
  priority: "critical" | "high" | "medium" | "low"
  category: "layout" | "navigation" | "accessibility" | "conversion" | "mobile" | "performance"
  title: string
  description: string
  implementation: string
  estimatedImpact: string
  effort: "low" | "medium" | "high"
  codeSnippet?: string
}

export interface AccessibilityReport {
  score: number
  issues: AccessibilityIssue[]
  compliance: {
    wcag2a: boolean
    wcag2aa: boolean
    wcag2aaa: boolean
  }
}

export interface AccessibilityIssue {
  type: "color" | "contrast" | "text" | "navigation" | "forms" | "images"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  element: string
  fix: string
}

export interface ConversionAnalysis {
  score: number
  opportunities: ConversionOpportunity[]
  bottlenecks: ConversionBottleneck[]
  suggestions: ConversionSuggestion[]
}

export interface ConversionOpportunity {
  element: string
  currentState: string
  suggestedChange: string
  expectedImprovement: string
  confidence: number
}

export interface ConversionBottleneck {
  element: string
  issue: string
  impact: string
  solution: string
}

export interface ConversionSuggestion {
  type: "cta" | "form" | "navigation" | "content" | "trust"
  suggestion: string
  rationale: string
  priority: "high" | "medium" | "low"
}

export interface CompetitiveAnalysis {
  industryBenchmarks: IndustryBenchmark[]
  bestPractices: BestPractice[]
  trends: Trend[]
}

export interface IndustryBenchmark {
  metric: string
  industry: string
  average: number
  top25: number
  yourScore: number
}

export interface BestPractice {
  category: string
  practice: string
  implementation: string
  benefit: string
}

export interface Trend {
  trend: string
  description: string
  adoption: string
  relevance: string
}

export class AIAnalysisService {
  static async analyzeFigmaDesign(
    figmaData: any,
    userData?: any,
    analyticsData?: any
  ): Promise<AnalysisResult> {
    try {
      // Prepare the analysis prompt
      const prompt = this.buildAnalysisPrompt(figmaData, userData, analyticsData)
      
      // Get AI analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert UX analyst with 15+ years of experience in user experience design, accessibility, conversion optimization, and competitive analysis. Your task is to analyze Figma designs and provide comprehensive UX insights.

Key areas to analyze:
1. Layout and visual hierarchy
2. Navigation and user flow
3. Accessibility compliance (WCAG 2.1 AA)
4. Conversion optimization opportunities
5. Mobile responsiveness
6. Performance considerations
7. Competitive positioning
8. Best practices alignment

Provide specific, actionable insights with confidence scores and implementation guidance.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })

      const analysisText = completion.choices[0]?.message?.content
      if (!analysisText) {
        throw new Error("No analysis result received")
      }

      // Parse the AI response into structured data
      const result = this.parseAnalysisResult(analysisText, figmaData)
      
      return result
    } catch (error) {
      console.error("AI Analysis error:", error)
      throw new Error("Failed to analyze design")
    }
  }

  private static buildAnalysisPrompt(
    figmaData: any,
    userData?: any,
    analyticsData?: any
  ): string {
    let prompt = `Analyze the following Figma design data and provide comprehensive UX insights:

DESIGN DATA:
${JSON.stringify(figmaData, null, 2)}

`

    if (userData) {
      prompt += `USER CONTEXT:
${JSON.stringify(userData, null, 2)}

`
    }

    if (analyticsData) {
      prompt += `ANALYTICS DATA:
${JSON.stringify(analyticsData, null, 2)}

`
    }

    prompt += `Please provide a comprehensive analysis in the following JSON format:

{
  "insights": [
    {
      "id": "unique-id",
      "type": "positive|negative|neutral",
      "category": "layout|navigation|accessibility|conversion|mobile|performance",
      "title": "Brief title",
      "description": "Detailed description",
      "impact": "high|medium|low",
      "confidence": 0.95,
      "evidence": ["evidence1", "evidence2"],
      "element": "element-id"
    }
  ],
  "recommendations": [
    {
      "id": "unique-id",
      "priority": "critical|high|medium|low",
      "category": "layout|navigation|accessibility|conversion|mobile|performance",
      "title": "Brief title",
      "description": "Detailed description",
      "implementation": "Step-by-step implementation",
      "estimatedImpact": "Expected improvement",
      "effort": "low|medium|high",
      "codeSnippet": "CSS/HTML if applicable"
    }
  ],
  "accessibility": {
    "score": 85,
    "issues": [
      {
        "type": "color|contrast|text|navigation|forms|images",
        "severity": "critical|high|medium|low",
        "description": "Issue description",
        "element": "element-id",
        "fix": "How to fix"
      }
    ],
    "compliance": {
      "wcag2a": true,
      "wcag2aa": false,
      "wcag2aaa": false
    }
  },
  "conversion": {
    "score": 78,
    "opportunities": [
      {
        "element": "element-id",
        "currentState": "Current state",
        "suggestedChange": "Suggested change",
        "expectedImprovement": "Expected improvement",
        "confidence": 0.9
      }
    ],
    "bottlenecks": [
      {
        "element": "element-id",
        "issue": "Issue description",
        "impact": "Impact on conversion",
        "solution": "Solution"
      }
    ],
    "suggestions": [
      {
        "type": "cta|form|navigation|content|trust",
        "suggestion": "Suggestion",
        "rationale": "Why this helps",
        "priority": "high|medium|low"
      }
    ]
  },
  "competitive": {
    "industryBenchmarks": [
      {
        "metric": "Conversion rate",
        "industry": "E-commerce",
        "average": 2.5,
        "top25": 4.2,
        "yourScore": 3.1
      }
    ],
    "bestPractices": [
      {
        "category": "CTAs",
        "practice": "Use contrasting colors",
        "implementation": "How to implement",
        "benefit": "Benefit"
      }
    ],
    "trends": [
      {
        "trend": "Micro-interactions",
        "description": "Description",
        "adoption": "Adoption rate",
        "relevance": "Relevance to this design"
      }
    ]
  },
  "score": 82
}

Focus on actionable insights that can improve user experience, accessibility, and conversion rates.`

    return prompt
  }

  private static parseAnalysisResult(analysisText: string, figmaData: any): AnalysisResult {
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in analysis response")
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        accessibility: parsed.accessibility || { score: 0, issues: [], compliance: { wcag2a: false, wcag2aa: false, wcag2aaa: false } },
        conversion: parsed.conversion || { score: 0, opportunities: [], bottlenecks: [], suggestions: [] },
        competitive: parsed.competitive || { industryBenchmarks: [], bestPractices: [], trends: [] },
        score: parsed.score || 0
      }
    } catch (error) {
      console.error("Error parsing analysis result:", error)
      // Return a basic structure if parsing fails
      return {
        insights: [],
        recommendations: [],
        accessibility: { score: 0, issues: [], compliance: { wcag2a: false, wcag2aa: false, wcag2aaa: false } },
        conversion: { score: 0, opportunities: [], bottlenecks: [], suggestions: [] },
        competitive: { industryBenchmarks: [], bestPractices: [], trends: [] },
        score: 0
      }
    }
  }

  static async generateReport(analysisId: string, reportType: string): Promise<any> {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { project: true }
    })

    if (!analysis || !analysis.result) {
      throw new Error("Analysis not found or incomplete")
    }

    const result = analysis.result as AnalysisResult
    
    switch (reportType) {
      case "executive":
        return this.generateExecutiveReport(result, analysis)
      case "detailed":
        return this.generateDetailedReport(result, analysis)
      case "technical":
        return this.generateTechnicalReport(result, analysis)
      case "accessibility":
        return this.generateAccessibilityReport(result, analysis)
      case "conversion":
        return this.generateConversionReport(result, analysis)
      default:
        return this.generateExecutiveReport(result, analysis)
    }
  }

  private static generateExecutiveReport(result: AnalysisResult, analysis: any) {
    return {
      title: "UX Analysis Executive Summary",
      summary: `Overall UX Score: ${result.score}/100`,
      keyFindings: result.insights.filter(i => i.impact === "high").slice(0, 5),
      topRecommendations: result.recommendations.filter(r => r.priority === "critical" || r.priority === "high").slice(0, 3),
      accessibility: result.accessibility.score,
      conversion: result.conversion.score,
      nextSteps: this.generateNextSteps(result)
    }
  }

  private static generateDetailedReport(result: AnalysisResult, analysis: any) {
    return {
      title: "Comprehensive UX Analysis Report",
      analysis: result,
      project: analysis.project,
      generatedAt: new Date().toISOString()
    }
  }

  private static generateTechnicalReport(result: AnalysisResult, analysis: any) {
    return {
      title: "Technical UX Implementation Guide",
      accessibility: result.accessibility,
      codeRecommendations: result.recommendations.filter(r => r.codeSnippet),
      performance: result.insights.filter(i => i.category === "performance"),
      implementation: result.recommendations.map(r => ({
        ...r,
        implementation: r.implementation
      }))
    }
  }

  private static generateAccessibilityReport(result: AnalysisResult, analysis: any) {
    return {
      title: "Accessibility Compliance Report",
      score: result.accessibility.score,
      compliance: result.accessibility.compliance,
      issues: result.accessibility.issues,
      recommendations: result.recommendations.filter(r => r.category === "accessibility")
    }
  }

  private static generateConversionReport(result: AnalysisResult, analysis: any) {
    return {
      title: "Conversion Optimization Report",
      score: result.conversion.score,
      opportunities: result.conversion.opportunities,
      bottlenecks: result.conversion.bottlenecks,
      suggestions: result.conversion.suggestions,
      recommendations: result.recommendations.filter(r => r.category === "conversion")
    }
  }

  private static generateNextSteps(result: AnalysisResult): string[] {
    const steps = []
    
    if (result.accessibility.score < 80) {
      steps.push("Address critical accessibility issues to improve compliance")
    }
    
    if (result.conversion.score < 75) {
      steps.push("Implement high-priority conversion optimization recommendations")
    }
    
    const criticalIssues = result.insights.filter(i => i.impact === "high" && i.type === "negative")
    if (criticalIssues.length > 0) {
      steps.push(`Fix ${criticalIssues.length} critical UX issues identified`)
    }
    
    return steps
  }
} 