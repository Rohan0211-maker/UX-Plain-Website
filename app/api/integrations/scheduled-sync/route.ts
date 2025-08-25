import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createIntegrationService } from "@/lib/integrations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationIds, force = false } = body

    // Validate request
    if (!integrationIds || !Array.isArray(integrationIds)) {
      return NextResponse.json(
        { error: "Integration IDs array is required" },
        { status: 400 }
      )
    }

    const results = []

    for (const integrationId of integrationIds) {
      try {
        // Get integration
        const integration = await prisma.integration.findUnique({
          where: { id: integrationId }
        })

        if (!integration) {
          results.push({
            integrationId,
            success: false,
            error: "Integration not found"
          })
          continue
        }

        // Skip if already syncing and not forced
        if (integration.status === 'SYNCING' && !force) {
          results.push({
            integrationId,
            success: false,
            error: "Integration already syncing"
          })
          continue
        }

        // Update status to syncing
        await prisma.integration.update({
          where: { id: integrationId },
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
            where: { id: integrationId },
            data: { 
              status: "ACTIVE",
              lastSync: new Date(),
              updatedAt: new Date()
            }
          })

          // Log successful sync
          await prisma.integrationLog.create({
            data: {
              integrationId: integration.id,
              type: "sync_complete",
              message: "Scheduled sync completed successfully",
              data: JSON.stringify({ dataPoints: Object.keys(syncData).length }),
              timestamp: new Date()
            }
          })

          results.push({
            integrationId,
            success: true,
            message: "Sync completed successfully",
            dataPoints: Object.keys(syncData).length
          })

        } catch (error) {
          // Update integration with error status
          await prisma.integration.update({
            where: { id: integrationId },
            data: { 
              status: "ERROR",
              updatedAt: new Date()
            }
          })

          // Log the error
          await prisma.integrationLog.create({
            data: {
              integrationId: integration.id,
              type: "error",
              message: "Scheduled sync failed",
              data: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
              timestamp: new Date()
            }
          })

          results.push({
            integrationId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          })
        }

      } catch (error) {
        results.push({
          integrationId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Scheduled sync completed",
      results
    })

  } catch (error) {
    console.error("Scheduled sync error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Scheduled sync failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (type) {
      where.type = type
    }

    // Get integrations that are ready for sync
    const integrations = await prisma.integration.findMany({
      where: {
        ...where,
        status: { not: "SYNCING" } // Exclude currently syncing integrations
      },
      select: {
        id: true,
        type: true,
        name: true,
        status: true,
        lastSync: true,
        updatedAt: true
      },
      orderBy: { lastSync: "asc" }, // Prioritize integrations that haven't synced recently
      take: limit
    })

    return NextResponse.json({
      integrations,
      total: integrations.length,
      readyForSync: integrations.filter(i => i.status === "ACTIVE" || i.status === "ERROR").length
    })

  } catch (error) {
    console.error("Scheduled sync status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
