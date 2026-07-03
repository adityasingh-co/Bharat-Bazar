import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

// Revalidate page data every 60 seconds for faster subsequent loads
export const revalidate = 60

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  const params = await props.searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  const category = typeof params.category === 'string' ? params.category : ''

  const supabase = await createClient()

  let productsQuery = supabase
    .from('products')
    .select('*, categories(*)')

  if (query) {
    productsQuery = productsQuery.ilike('name', `%${query}%`)
  }

  if (category) {
    productsQuery = productsQuery.eq('category_id', category)
  }

  const [{ data: products }, { data: categories }] = await Promise.all([
    productsQuery.order('created_at', { ascending: false }),
    supabase.from('categories').select('*')
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 text-zinc-50 dark:bg-zinc-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-transparent to-transparent" />
        </div>
        <div className="container relative mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
                Modern <span className="text-orange-600">Premium</span> Essentials
              </h1>
              <p className="mt-6 text-xl text-zinc-400">
                Discover our curated collection of high-quality products designed for the modern lifestyle.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg shadow-orange-900/20 transition-all hover:scale-105">
                  Shop Collection
                </Button>
                <Button size="lg" variant="outline" className="border-zinc-500 text-white hover:bg-white hover:text-zinc-900 bg-transparent transition-all hover:border-white">
                  Our Story
                </Button>
              </div>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <section className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              New Arrivals
            </h2>
            <p className="mt-2 text-zinc-500">The latest and greatest from our curated selection.</p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row md:max-w-md">
            <form className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="pl-10"
              />
            </form>
          </div>
        </section>

        <div className="mb-12 flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
              !category ? 'bg-orange-600 text-zinc-50 shadow-lg' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50'
            }`}
          >
            All Products
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                category === cat.id ? 'bg-orange-600 text-zinc-50 shadow-lg' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products?.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-xl font-medium">No products found</p>
            <p className="text-zinc-500">Try adjusting your search or explore other categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}

