import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PayPalService } from "@/lib/paypal"
import { z } from "zod"

const captureSchema = z.object({
  orderId: z.string()
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
    const validatedData = captureSchema.parse(body)

    // Capture the PayPal payment
    const captureResponse = await PayPalService.capturePayment(validatedData.orderId)

    if (!captureResponse.success) {
      return NextResponse.json(
        { error: captureResponse.error },
        { status: 400 }
      )
    }

    // Update payment record
    await prisma.payment.updateMany({
      where: {
        paymentId: validatedData.orderId,
        userId: session.user.id
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    })

    // Update user subscription/credits based on the payment
    const payment = await prisma.payment.findFirst({
      where: {
        paymentId: validatedData.orderId,
        userId: session.user.id
      }
    })

    if (payment) {
      // Update user plan and credits based on payment amount
      let newPlan = "STARTER"
      let creditsToAdd = 0

      if (payment.amount >= 99) {
        newPlan = "PROFESSIONAL"
        creditsToAdd = 10000
      } else if (payment.amount >= 49) {
        newPlan = "GROWTH"
        creditsToAdd = 5000
      } else if (payment.amount >= 29) {
        newPlan = "STARTER"
        creditsToAdd = 1000
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          plan: newPlan,
          credits: {
            increment: creditsToAdd
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Payment captured successfully"
    })

  } catch (error) {
    console.error("Payment capture error:", error)
    
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