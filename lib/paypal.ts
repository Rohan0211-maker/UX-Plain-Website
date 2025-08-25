// Simplified PayPal service using direct HTTP requests
// This avoids the complex SDK import issues

export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  planId: string
  userId: string
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  error?: string
  approvalUrl?: string
}

export class PayPalService {
  private static getAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID!
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
    const isLive = process.env.PAYPAL_MODE === 'live'
    const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    return fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => data.access_token)
  }

  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken()
      const isLive = process.env.PAYPAL_MODE === 'live'
      const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      
      const orderData = {
        intent: 'CAPTURE',
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/dashboard/payment/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/payment/cancel`,
          brand_name: 'UXplain',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING'
        },
        purchase_units: [
          {
            amount: {
              currency_code: request.currency,
              value: request.amount.toString()
            },
            description: request.description,
            custom_id: `${request.userId}_${request.planId}`,
            invoice_id: `INV-${Date.now()}-${request.userId}`
          }
        ]
      }

      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      
      if (result.id && result.links) {
        const approvalLink = result.links.find((link: any) => link.rel === 'approve')
        
        return {
          success: true,
          paymentId: result.id,
          approvalUrl: approvalLink?.href
        }
      }
      
      return {
        success: false,
        error: 'Failed to create payment order'
      }
    } catch (error) {
      console.error('PayPal payment creation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }
    }
  }

  static async capturePayment(orderId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken()
      const isLive = process.env.PAYPAL_MODE === 'live'
      const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      
      const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      
      if (result.status === 'COMPLETED') {
        return {
          success: true,
          paymentId: result.id
        }
      } else {
        return {
          success: false,
          error: 'Payment not completed'
        }
      }
    } catch (error) {
      console.error('PayPal payment capture error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment capture failed'
      }
    }
  }

  static async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()
      const isLive = process.env.PAYPAL_MODE === 'live'
      const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      
      const response = await fetch(`${baseUrl}/v2/checkout/orders/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('PayPal get payment details error:', error)
      throw error
    }
  }

  static async createSubscription(planId: string, userId: string): Promise<PaymentResponse> {
    try {
      // For subscriptions, we'll create a simple order that can be used for recurring billing
      const accessToken = await this.getAccessToken()
      const isLive = process.env.PAYPAL_MODE === 'live'
      const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      
      const orderData = {
        intent: 'CAPTURE',
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/cancel`,
          brand_name: 'UXplain',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING'
        },
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '29.99'
            },
            description: 'UXplain Monthly Subscription',
            custom_id: `${userId}_${planId}`,
            invoice_id: `SUB-${Date.now()}-${userId}`
          }
        ]
      }

      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      
      if (result.id && result.links) {
        const approvalLink = result.links.find((link: any) => link.rel === 'approve')
        
        return {
          success: true,
          paymentId: result.id,
          approvalUrl: approvalLink?.href
        }
      }
      
      return {
        success: false,
        error: 'Failed to create subscription order'
      }
    } catch (error) {
      console.error('PayPal subscription creation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription creation failed'
      }
    }
  }
} 