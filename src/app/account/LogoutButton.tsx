'use client'

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button 
        type="submit" 
        variant="outline" 
        className="w-full gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/20"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  )
}
