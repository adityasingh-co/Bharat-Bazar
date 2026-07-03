import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/product') ||
    pathname.startsWith('/checkout/success')

  // For public routes, skip auth check entirely for faster response
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Create response object
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          // Update request cookies
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => {
            request.cookies.set(name, value)
          })
          // Create new response with updated request
          supabaseResponse = NextResponse.next({
            request,
          })
          // Set cookies on response
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // User is authenticated - return response with cookies
  return supabaseResponse
}
