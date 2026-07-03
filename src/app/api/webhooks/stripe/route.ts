import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const metadata = session.metadata
      if (!metadata) {
        console.error('No metadata in session')
        return NextResponse.json({ received: true })
      }

      const userId = metadata.userId !== 'guest' ? metadata.userId : null
      const cartItemsRaw = metadata.cartItems

      if (!cartItemsRaw) {
        console.error('No cartItems in metadata')
        return NextResponse.json({ received: true })
      }

      const cartItems = JSON.parse(cartItemsRaw) as Array<{
        id: string
        quantity: number
        price: number
        name: string
      }>

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          status: 'completed',
          total_amount: totalAmount,
          stripe_session_id: session.id,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        )
      }

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        return NextResponse.json(
          { error: 'Failed to create order items' },
          { status: 500 }
        )
      }

      console.log('Order created successfully:', order.id)
    } catch (err) {
      console.error('Error processing webhook:', err)
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
