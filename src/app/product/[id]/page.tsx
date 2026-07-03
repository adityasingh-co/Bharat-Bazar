import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, Truck, Shield } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AddToCartButton } from './AddToCartButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category Badge */}
            {product.categories && (
              <Badge variant="secondary" className="w-fit mb-4">
                {product.categories.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-orange-600">
                {formatCurrency(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Description
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Free Shipping</p>
                  <p className="text-sm text-zinc-500">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Secure Payment</p>
                  <p className="text-sm text-zinc-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Easy Returns</p>
                  <p className="text-sm text-zinc-500">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
