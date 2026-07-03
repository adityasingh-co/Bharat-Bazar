import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { ProductDialog } from './ProductDialog'
import { ProductTableActions } from './ProductTableActions'

export default async function AdminProducts() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(id, name)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Products</h1>
          <p className="text-zinc-500">Manage your store inventory and stock levels.</p>
        </div>
        <ProductDialog categories={categories || []} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">{product.name}</div>
                  <div className="text-xs text-zinc-500 line-clamp-1">{product.description}</div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {product.categories?.name || 'Uncategorized'}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                  ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {product.stock} units
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <ProductTableActions product={product} categories={categories || []} />
                </TableCell>
              </TableRow>
            ))}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
