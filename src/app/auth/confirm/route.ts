import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const code = searchParams.get('code')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = new URL(next, origin)
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Handle PKCE flow (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }
    console.error('Code exchange error:', error)
  }

  // Handle magic link / OTP flow (token_hash)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }
    console.error('OTP verification error:', error)
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/login'
  redirectTo.searchParams.set('error', 'Email verification failed. Please try again.')
  return NextResponse.redirect(redirectTo)
}
