import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

// Force dynamic rendering for admin pages to ensure fresh auth state
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Use getSession for faster check, then validate with getUser
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:block">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-orange-600 flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl">ADMIN</span>
        </div>
        
        <div className="flex flex-col gap-2 h-[calc(100vh-180px)]">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
        </div>

        <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 md:ml-64">
        {children}
      </main>
    </div>
  )
}
