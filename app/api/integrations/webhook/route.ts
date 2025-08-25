import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createIntegrationService } from "@/lib/integrations"
import { z } from "zod"

const webhookSchema = z.object({
  integrationId: z.string(),
  type: z.enum(["data_update", "status_change", "error", "sync_complete"]),
  data: z.record(z.any()).optional(),
  message: z.string().optional(),
  timestamp: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = webhookSchema.parse(body)

    // Verify webhook signature if configured
    const signature = request.headers.get('x-webhook-signature')
    if (signature) {
      // TODO: Implement signature verification
      // const isValid = verifyWebhookSignature(signature, body, webhookSecret)
      // if (!isValid) {
      //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      // }
    }

    // Get integration
    const integration = await prisma.integration.findUnique({
      where: { id: validatedData.integrationId }
    })

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      )
    }

    // Process webhook based on type
    switch (validatedData.type) {
      case "data_update":
        await handleDataUpdate(integration, validatedData)
        break
      
      case "status_change":
        await handleStatusChange(integration, validatedData)
        break
      
      case "error":
        await handleError(integration, validatedData)
        break
      
      case "sync_complete":
        await handleSyncComplete(integration, validatedData)
        break
      
      default:
        return NextResponse.json(
          { error: "Unknown webhook type" },
          { status: 400 }
        )
    }

    // Log webhook event
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: validatedData.type,
        message: validatedData.message || `Webhook received: ${validatedData.type}`,
        data: JSON.stringify(validatedData.data || {}),
        timestamp: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully"
    })

  } catch (error) {
    console.error("Webhook processing error:", error)
    
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

async function handleDataUpdate(integration: any, webhookData: any) {
  // Update integration with new data
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      lastSync: new Date(),
      updatedAt: new Date()
    }
  })

  // Store the updated data (you might want to create a separate table for this)
  console.log(`Data update for integration ${integration.id}:`, webhookData.data)
}

async function handleStatusChange(integration: any, webhookData: any) {
  const newStatus = webhookData.data?.status || integration.status
  
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      status: newStatus,
      updatedAt: new Date()
    }
  })
}

async function handleError(integration: any, webhookData: any) {
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      status: "ERROR",
      updatedAt: new Date()
    }
  })

  // Log the error
  console.error(`Integration error for ${integration.id}:`, webhookData.message)
}

async function handleSyncComplete(integration: any, webhookData: any) {
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      status: "ACTIVE",
      lastSync: new Date(),
      updatedAt: new Date()
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get("integrationId")
    const limit = parseInt(searchParams.get("limit") || "50")

    if (!integrationId) {
      return NextResponse.json(
        { error: "Integration ID is required" },
        { status: 400 }
      )
    }

    // Get webhook logs for the integration
    const logs = await prisma.integrationLog.findMany({
      where: { integrationId },
      orderBy: { timestamp: "desc" },
      take: limit
    })

    return NextResponse.json({ logs })

  } catch (error) {
    console.error("Webhook logs fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
