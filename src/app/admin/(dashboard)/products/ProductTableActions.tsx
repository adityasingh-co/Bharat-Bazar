'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { ProductDialog } from './ProductDialog'
import { deleteProduct } from '@/app/actions/products'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ProductTableActionsProps {
  product: any
  categories: any[]
}

export function ProductTableActions({ product, categories }: ProductTableActionsProps) {
  const [loading, setLoading] = useState(false)

  async function onDelete() {
    setLoading(true)
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <ProductDialog
        product={product}
        categories={categories}
        trigger={
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{product.name}" from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
