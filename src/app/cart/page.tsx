'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalCount } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-zinc-500 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/">
          <Button className="mt-8 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned:', data.error)
        alert('Checkout failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart ({totalCount})</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between self-stretch">
                  <div className="flex justify-between">
                    <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</h3>
                          <p className="text-sm text-zinc-500">{formatCurrency(item.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-bold ml-auto">{formatCurrency(item.price * item.quantity)}</p>
                      </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>

              <Button 
                className="mt-6 w-full gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                size="lg"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Secure checkout powered by Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
