import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createIntegrationService } from "@/lib/integrations"
import { z } from "zod"

const updateIntegrationSchema = z.object({
  name: z.string().min(1, "Integration name is required").optional(),
  config: z.record(z.any()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ERROR", "SYNCING"]).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        projectIntegrations: {
          include: {
            project: true
          }
        }
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ integration })

  } catch (error) {
    console.error("Integration fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateIntegrationSchema.parse(body)

    // Check if integration exists and belongs to user
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingIntegration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    // If config is being updated, validate it
    if (validatedData.config) {
      const validationResult = await validateIntegrationConfig(existingIntegration.type, validatedData.config)
      if (!validationResult.valid) {
        return NextResponse.json(
          { error: "Invalid integration configuration", details: validationResult.errors },
          { status: 400 }
        )
      }

      // Test the new configuration
      try {
        const service = createIntegrationService(existingIntegration.type, validatedData.config)
        const isConnected = await service.testConnection()
        
        if (!isConnected) {
          validatedData.status = "ERROR"
        }
      } catch (error) {
        validatedData.status = "ERROR"
      }
    }

    // Update integration
    const updatedIntegration = await prisma.integration.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "Integration updated successfully",
      integration: updatedIntegration
    })

  } catch (error) {
    console.error("Integration update error:", error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if integration exists and belongs to user
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingIntegration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    // Delete project integrations first
    await prisma.projectIntegration.deleteMany({
      where: { integrationId: id }
    })

    // Delete the integration
    await prisma.integration.delete({
      where: { id: id }
    })

    return NextResponse.json({
      message: "Integration deleted successfully"
    })

  } catch (error) {
    console.error("Integration deletion error:", error)
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
      if (!config.endpoint || !config.method || !config.auth) {
        errors.push("Custom integration endpoint, method, and auth configuration are required")
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
