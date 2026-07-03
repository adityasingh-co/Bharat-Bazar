import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
        <Package className="h-10 w-10 text-zinc-400" />
      </div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Product Not Found</h1>
      <p className="mt-2 text-zinc-500 max-w-md">
        Sorry, we couldn't find the product you're looking for. It may have been removed or doesn't exist.
      </p>
      <Link href="/" className="mt-8">
        <Button className="bg-orange-600 hover:bg-orange-700">
          Back to Shop
        </Button>
      </Link>
    </div>
  )
}
