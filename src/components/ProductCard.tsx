'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { memo } from 'react'

export const ProductCard = memo(function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card 
        className="group overflow-hidden border-zinc-200 transition-all hover:shadow-xl dark:border-zinc-800 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1 text-lg group-hover:text-orange-600 transition-colors">{product.name}</CardTitle>
          <p className="text-sm text-zinc-500 line-clamp-2">{product.description}</p>
        </CardHeader>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-lg font-bold text-orange-600">{formatCurrency(product.price)}</span>
          <Button 
            size="icon" 
            onClick={handleAddToCart}
            className="bg-zinc-900 text-white hover:bg-orange-600 transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-orange-500 dark:hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
})
