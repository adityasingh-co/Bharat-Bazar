'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Payment Successful!
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          {sessionId && (
            <p className="mb-6 text-sm text-zinc-500">
              Order reference: {sessionId.slice(-8).toUpperCase()}
            </p>
          )}
          <div className="flex w-full flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <p className="text-zinc-500">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
