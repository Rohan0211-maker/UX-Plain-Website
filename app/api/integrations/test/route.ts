import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createIntegrationService } from "@/lib/integrations"
import { z } from "zod"

const testIntegrationSchema = z.object({
  type: z.enum(["GOOGLE_ANALYTICS", "HOTJAR", "POWERBI", "MIXPANEL", "AMPLITUDE", "CUSTOM"]),
  config: z.record(z.any())
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
    const validatedData = testIntegrationSchema.parse(body)

    try {
      // Create integration service
      const service = createIntegrationService(validatedData.type, validatedData.config)
      
      // Test connection
      const isConnected = await service.testConnection()
      
      if (isConnected) {
        // Try to fetch some data
        let sampleData: any = {}
        
        switch (validatedData.type) {
          case "GOOGLE_ANALYTICS":
            const today = new Date().toISOString().split('T')[0]
            sampleData = await service.getAnalyticsData(today, today)
            break
          case "HOTJAR":
            sampleData = await service.getSiteData()
            break
          case "POWERBI":
            sampleData = await service.getWorkspaceData()
            break
          case "MIXPANEL":
            const todayMixpanel = new Date().toISOString().split('T')[0]
            sampleData = await service.getAnalyticsData(todayMixpanel, todayMixpanel)
            break
          case "AMPLITUDE":
            const todayAmplitude = new Date().toISOString().split('T')[0]
            sampleData = await service.getAnalyticsData(todayAmplitude, todayAmplitude)
            break
          case "CUSTOM":
            sampleData = await service.getData()
            break
        }

        return NextResponse.json({
          success: true,
          message: "Integration test successful",
          type: validatedData.type,
          sampleData
        })
      } else {
        return NextResponse.json({
          success: false,
          message: "Integration connection failed",
          type: validatedData.type
        }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Integration test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        type: validatedData.type
      }, { status: 400 })
    }

  } catch (error) {
    console.error("Integration test error:", error)
    
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
