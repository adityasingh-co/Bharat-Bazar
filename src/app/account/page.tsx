import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Package, ShoppingBag, Mail, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { LogoutButton } from './LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile (may not exist)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    .catch(() => ({ data: null }))

  // Get user orders (table may not exist)
  let orders: any[] = []
  try {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    orders = data || []
  } catch {
    orders = []
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Account
          </h1>
          <p className="text-zinc-500 mt-1">Manage your profile and view your orders</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info */}
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <User className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle className="text-xl">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-600 dark:text-zinc-400">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <LogoutButton />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <span className="text-lg font-bold">{totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Total Spent</span>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(totalSpent)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Orders */}
          <div className="lg:col-span-2">
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Order History</CardTitle>
                    <CardDescription>View all your past orders</CardDescription>
                  </div>
                  <Link href="/">
                    <Button variant="outline" size="sm">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <div>
                            <p className="text-sm text-zinc-500">Order ID</p>
                            <p className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Date</p>
                            <p className="text-sm font-medium">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Total</p>
                            <p className="text-sm font-bold text-orange-600">{formatCurrency(order.total_amount)}</p>
                          </div>
                          <Badge 
                            variant={order.status === 'completed' || order.status === 'paid' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        
                        {/* Order Items */}
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                            <p className="text-sm font-medium mb-2">Items:</p>
                            <div className="space-y-2">
                              {order.order_items.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-600 dark:text-zinc-400">
                                    {item.products?.name || 'Product'} × {item.quantity}
                                  </span>
                                  <span className="font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                      <Package className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No orders yet</h3>
                    <p className="text-zinc-500 mt-1 mb-4">Start shopping to see your orders here</p>
                    <Link href="/">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
