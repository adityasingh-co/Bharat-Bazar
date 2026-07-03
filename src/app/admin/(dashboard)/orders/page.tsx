import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function AdminOrders() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-zinc-500">View and manage customer orders.</p>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs uppercase">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.profiles?.full_name || 'Guest'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>₹{Number(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                  <Badge 
                    variant={order.status === 'completed' || order.status === 'paid' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
