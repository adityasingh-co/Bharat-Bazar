'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, memo } from 'react'
import { logout } from '@/app/actions/auth'

// Memoized Navbar to prevent unnecessary re-renders
export const Navbar = memo(function Navbar({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" prefetch={true}>
          <span className="text-2xl font-black tracking-tighter text-orange-600 dark:text-orange-500">
            BHARAT
          </span>
          <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
            BAZAAR
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-zinc-500" prefetch={true}>Shop</Link>
          <Link href="/categories" className="text-sm font-medium transition-colors hover:text-zinc-500" prefetch={true}>Categories</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-zinc-500" prefetch={true}>Admin</Link>
          )}
        </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/cart" prefetch={true}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account" prefetch={true}>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/account" className="text-sm font-medium hover:text-orange-600 transition-colors">
                  {user.full_name || 'Account'}
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" prefetch={true}>
                    <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">Login</Button>
                  </Link>
                  <Link href="/admin/login" prefetch={true}>
                    <Button variant="default" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20 transition-all hover:scale-105">Admin</Button>
                  </Link>
                </div>
            )}
          </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link href="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
            <Link href="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="font-medium">My Account</Link>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
                  <form action={logout}>
                    <Button variant="ghost" className="w-full justify-start px-0 text-red-500">Logout</Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link href="/admin/login" onClick={() => setIsMenuOpen(false)} className="text-orange-600 font-bold">Admin Portal</Link>
                </div>
              )}
          </div>
        </div>
      )}
    </nav>
  )
})
