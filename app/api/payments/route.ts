import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PayPalService, PaymentRequest } from "@/lib/paypal"
import { z } from "zod"

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  description: z.string(),
  planId: z.string()
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
    const validatedData = paymentSchema.parse(body)

    // Create payment request
    const paymentRequest: PaymentRequest = {
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: validatedData.description,
      planId: validatedData.planId,
      userId: session.user.id
    }

    // Create PayPal payment
    const paymentResponse = await PayPalService.createPayment(paymentRequest)

    if (!paymentResponse.success) {
      return NextResponse.json(
        { error: paymentResponse.error },
        { status: 400 }
      )
    }

    // Log payment attempt
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: "PENDING",
        paymentMethod: "PAYPAL",
        paymentId: paymentResponse.paymentId,
        description: validatedData.description
      }
    })

    return NextResponse.json({
      success: true,
      paymentId: paymentResponse.paymentId,
      approvalUrl: paymentResponse.approvalUrl
    })

  } catch (error) {
    console.error("Payment creation error:", error)
    
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
    const paymentId = searchParams.get("paymentId")

    if (paymentId) {
      // Get specific payment details
      const payment = await prisma.payment.findFirst({
        where: {
          id: paymentId,
          userId: session.user.id
        }
      })

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({ payment })
    }

    // Get user's payment history
    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ payments })

  } catch (error) {
    console.error("Payment fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 