import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createIntegrationService } from "@/lib/integrations"

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

    // Get integration logs
    const logs = await prisma.integrationLog.findMany({
      where: { integrationId: id },
      orderBy: { timestamp: "desc" },
      take: 100
    })

    // Try to fetch current data from the integration
    let currentData = null
    try {
      const service = createIntegrationService(integration.type, JSON.parse(integration.config))
      
      // Get data based on integration type
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      switch (integration.type) {
        case "GOOGLE_ANALYTICS":
        case "MIXPANEL":
        case "AMPLITUDE":
          currentData = await service.getAnalyticsData(thirtyDaysAgo, today)
          break
        case "HOTJAR":
          currentData = await service.getSiteData()
          break
        case "POWERBI":
          currentData = await service.getWorkspaceData()
          break
        case "CUSTOM":
          currentData = await service.getData()
          break
        default:
          currentData = { message: "Data export not supported for this integration type" }
      }
    } catch (error) {
      currentData = { error: "Failed to fetch current data", message: error instanceof Error ? error.message : "Unknown error" }
    }

    // Prepare export data
    const exportData = {
      integration: {
        id: integration.id,
        type: integration.type,
        name: integration.name,
        status: integration.status,
        lastSync: integration.lastSync,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
        config: JSON.parse(integration.config)
      },
      logs: logs.map(log => ({
        id: log.id,
        type: log.type,
        message: log.message,
        data: log.data ? JSON.parse(log.data) : null,
        timestamp: log.timestamp
      })),
      currentData,
      exportDate: new Date().toISOString(),
      exportVersion: "1.0"
    }

    // Return as JSON file
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${integration.name}-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    console.error("Integration export error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Integration export failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
