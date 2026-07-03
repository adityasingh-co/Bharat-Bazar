import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, AlertTriangle, IndianRupee } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { data: lowStockProducts },
    { count: orderCount },
    { data: orders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('id').lte('stock', 5),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount')
  ])

  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      description: 'Lifetime store earnings',
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: orderCount || 0,
      icon: ShoppingBag,
      description: 'Total orders placed',
      color: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: productCount || 0,
      icon: Package,
      description: 'Items in your catalog',
      color: 'text-orange-600',
    },
    {
      title: 'Low Stock',
      value: lowStockProducts?.length || 0,
      icon: AlertTriangle,
      description: 'Items with stock ≤ 5',
      color: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-zinc-500">Welcome back. Here's what's happening in your store.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
              <p className="text-xs text-zinc-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Recent Activity/Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-zinc-500 italic">Order tracking and detailed analytics coming soon.</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-zinc-500 italic">Automatic stock alerts and restock predictions coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
