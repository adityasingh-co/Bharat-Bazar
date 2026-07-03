'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
    </Button>
  )
}

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-black tracking-tighter">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Enter your information to start shopping'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={isLogin ? login : signup} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" required className="bg-zinc-50 dark:bg-zinc-900/50" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-zinc-50 dark:bg-zinc-900/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
                <Input id="password" name="password" type="password" required className="bg-zinc-50 dark:bg-zinc-900/50" />
              </div>
              {error && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/50 text-center">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded border border-emerald-100 dark:border-emerald-900/50 text-center">
                  {message}
                </p>
              )}
              <SubmitButton isLogin={isLogin} />
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              {isLogin ? "Naye ho? " : "Pahle se account hai? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
