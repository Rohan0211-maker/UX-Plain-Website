import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  figmaUrl: z.string().url("Invalid Figma URL").optional(),
  figmaFileId: z.string().optional()
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
    const validatedData = projectSchema.parse(body)

    // Extract Figma file ID from URL if provided
    let figmaFileId = validatedData.figmaFileId
    if (validatedData.figmaUrl && !figmaFileId) {
      const match = validatedData.figmaUrl.match(/file\/([a-zA-Z0-9]+)/)
      if (match) {
        figmaFileId = match[1]
      }
    }

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        figmaUrl: validatedData.figmaUrl,
        figmaFileId: figmaFileId,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      message: "Project created successfully",
      project
    })

  } catch (error) {
    console.error("Project creation error:", error)
    
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
    const status = searchParams.get("status")

    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 3
        },
        integrations: {
          include: {
            integration: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({ projects })

  } catch (error) {
    console.error("Project fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 