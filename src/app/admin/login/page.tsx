'use client'

import { adminLogin } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

function AdminLoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 shadow-lg shadow-orange-900/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">ADMIN PORTAL</h1>
          <p className="text-zinc-500">Inventory & Store Management System</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-500" />
              Secure Authorization
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Enter your credentials to access the administrative dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={adminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-400">Admin Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@bharatbazaar.in" 
                  required 
                  className="border-zinc-800 bg-zinc-950 text-white focus:ring-orange-600" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400">Security Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="border-zinc-800 bg-zinc-950 text-white focus:ring-orange-600" 
                />
              </div>
              
              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                  <p className="text-sm font-medium text-red-500">
                    {error}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full bg-orange-600 font-bold text-white hover:bg-orange-700">
                Authorize Access
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">
            Protected by Enterprise Security
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Initialising Secure Session...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
