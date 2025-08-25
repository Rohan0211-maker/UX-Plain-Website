import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const integrationSchema = z.object({
  type: z.enum(["FIGMA", "GOOGLE_ANALYTICS", "HOTJAR", "POWERBI", "MIXPANEL", "AMPLITUDE", "CUSTOM"]),
  name: z.string().min(1, "Integration name is required"),
  config: z.record(z.any()),
  projectId: z.string().optional()
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
    const validatedData = integrationSchema.parse(body)

    // Validate integration config based on type
    const validationResult = await validateIntegrationConfig(validatedData.type, validatedData.config)
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: "Invalid integration configuration", details: validationResult.errors },
        { status: 400 }
      )
    }

    // Create integration
    const integration = await prisma.integration.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        config: validatedData.config,
        userId: session.user.id
      }
    })

    // Link to project if provided
    if (validatedData.projectId) {
      await prisma.projectIntegration.create({
        data: {
          projectId: validatedData.projectId,
          integrationId: integration.id
        }
      })
    }

    return NextResponse.json({
      message: "Integration created successfully",
      integration
    })

  } catch (error) {
    console.error("Integration creation error:", error)
    
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
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const where: any = {
      userId: session.user.id
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    const integrations = await prisma.integration.findMany({
      where,
      include: {
        projectIntegrations: {
          include: {
            project: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ integrations })

  } catch (error) {
    console.error("Integration fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function validateIntegrationConfig(type: string, config: any) {
  const errors: string[] = []

  switch (type) {
    case "FIGMA":
      if (!config.accessToken && !config.fileUrl) {
        errors.push("Figma access token or file URL is required")
      }
      break

    case "GOOGLE_ANALYTICS":
      if (!config.propertyId || !config.credentials) {
        errors.push("Google Analytics property ID and credentials are required")
      }
      break

    case "HOTJAR":
      if (!config.siteId || !config.accessToken) {
        errors.push("Hotjar site ID and access token are required")
      }
      break

    case "POWERBI":
      if (!config.workspaceId || !config.datasetId || !config.credentials) {
        errors.push("PowerBI workspace ID, dataset ID, and credentials are required")
      }
      break

    case "MIXPANEL":
      if (!config.projectId || !config.apiSecret) {
        errors.push("Mixpanel project ID and API secret are required")
      }
      break

    case "AMPLITUDE":
      if (!config.apiKey || !config.secretKey) {
        errors.push("Amplitude API key and secret key are required")
      }
      break

    case "CUSTOM":
      if (!config.endpoint || !config.headers) {
        errors.push("Custom integration endpoint and headers are required")
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors
  }
} 