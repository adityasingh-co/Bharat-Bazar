'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit } from 'lucide-react'
import { createProduct, updateProduct } from '@/app/actions/products'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category_id: string
  image_url: string
}

interface ProductDialogProps {
  product?: Product
  categories: Category[]
  trigger?: React.ReactNode
}

export function ProductDialog({ product, categories, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      if (product) {
        await updateProduct(product.id, formData)
        toast.success('Product updated successfully')
      } else {
        await createProduct(formData)
        toast.success('Product created successfully')
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                placeholder="Product name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={product?.category_id} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product?.stock}
                placeholder="0"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                defaultValue={product?.image_url}
                placeholder="https://..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description}
                placeholder="Product description"
                className="min-h-[100px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
