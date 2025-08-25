import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AIAnalysisService } from "@/lib/ai-analysis"
import { z } from "zod"

const analysisSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1, "Analysis name is required"),
  description: z.string().optional(),
  figmaData: z.any(),
  userData: z.any().optional(),
  analyticsData: z.any().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = analysisSchema.parse(body)

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.creditsUsed >= user.credits) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      )
    }

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        status: "PENDING",
        progress: 0,
        userId: session.user.id,
        projectId: validatedData.projectId
      }
    })

    // Log analysis start
    await prisma.analysisLog.create({
      data: {
        analysisId: analysis.id,
        level: "INFO",
        message: "Analysis started",
        data: { figmaData: validatedData.figmaData }
      }
    })

    // Start analysis in background
    startAnalysis(analysis.id, validatedData)

    return NextResponse.json({
      message: "Analysis started",
      analysisId: analysis.id,
      status: "PENDING"
    })

  } catch (error) {
    console.error("Analysis creation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const where: any = {
      userId: session.user.id
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (status) {
      where.status = status
    }

    const analyses = await prisma.analysis.findMany({
      where,
      include: {
        project: true,
        logs: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ analyses })

  } catch (error) {
    console.error("Analysis fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function startAnalysis(analysisId: string, data: any) {
  try {
    // Update status to running
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "RUNNING", progress: 10 }
    })

    await prisma.analysisLog.create({
      data: {
        analysisId,
        level: "INFO",
        message: "AI analysis in progress",
        data: { progress: 10 }
      }
    })

    // Perform AI analysis
    const result = await AIAnalysisService.analyzeFigmaDesign(
      data.figmaData,
      data.userData,
      data.analyticsData
    )

    // Update analysis with results
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: "COMPLETED",
        progress: 100,
        result: result,
        insights: result.insights,
        recommendations: result.recommendations,
        completedAt: new Date()
      }
    })

    // Log completion
    await prisma.analysisLog.create({
      data: {
        analysisId,
        level: "INFO",
        message: "Analysis completed successfully",
        data: { score: result.score }
      }
    })

    // Update user credits
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        creditsUsed: {
          increment: 1
        }
      }
    })

  } catch (error) {
    console.error("Analysis execution error:", error)
    
    // Update status to failed
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "FAILED" }
    })

    await prisma.analysisLog.create({
      data: {
        analysisId,
        level: "ERROR",
        message: "Analysis failed",
        data: { error: error instanceof Error ? error.message : "Unknown error" }
      }
    })
  }
} 