import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const { items, userId } = await request.json() as { items: CartItem[]; userId?: string }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        userId: userId || 'guest',
        cartItems: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          }))
        ),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
