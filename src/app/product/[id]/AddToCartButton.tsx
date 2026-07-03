'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantity:</span>
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={() => setQuantity(quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className={`w-full gap-2 text-lg font-bold transition-all ${
          added 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-orange-600 hover:bg-orange-700'
        }`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        <ShoppingCart className="h-5 w-5" />
        {added ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
