import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createIntegrationService } from "@/lib/integrations"

export async function POST(
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

    // Get integration
    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    // Update status to syncing
    await prisma.integration.update({
      where: { id: id },
      data: { 
        status: "SYNCING",
        updatedAt: new Date()
      }
    })

    try {
      // Create service and fetch data
      const service = createIntegrationService(integration.type, JSON.parse(integration.config))
      
      let syncData: any = {}
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      switch (integration.type) {
        case "GOOGLE_ANALYTICS":
          syncData = await service.getAnalyticsData(thirtyDaysAgo, today)
          break
        case "HOTJAR":
          syncData = await service.getSiteData()
          break
        case "POWERBI":
          syncData = await service.getWorkspaceData()
          break
        case "MIXPANEL":
          syncData = await service.getAnalyticsData(thirtyDaysAgo, today)
          break
        case "AMPLITUDE":
          syncData = await service.getAnalyticsData(thirtyDaysAgo, today)
          break
        case "CUSTOM":
          syncData = await service.getData()
          break
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`)
      }

      // Update integration with success status and last sync time
      await prisma.integration.update({
        where: { id: id },
        data: { 
          status: "ACTIVE",
          lastSync: new Date(),
          updatedAt: new Date()
        }
      })

      // Store sync data in a separate table or update existing data
      // For now, we'll just return the sync data
      return NextResponse.json({
        success: true,
        message: "Integration synced successfully",
        data: syncData,
        lastSync: new Date().toISOString()
      })

    } catch (error) {
      // Update integration with error status
      await prisma.integration.update({
        where: { id: id },
        data: { 
          status: "ERROR",
          updatedAt: new Date()
        }
      })

      throw error
    }

  } catch (error) {
    console.error("Integration sync error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Integration sync failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

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

    // Get integration sync status
    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      select: {
        id: true,
        status: true,
        lastSync: true,
        updatedAt: true
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: integration.id,
      status: integration.status,
      lastSync: integration.lastSync,
      lastUpdated: integration.updatedAt
    })

  } catch (error) {
    console.error("Integration sync status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
