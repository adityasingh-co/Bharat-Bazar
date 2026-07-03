import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes that don't need auth
  const pathname = request.nextUrl.pathname
  
  // Skip static assets and public routes for faster response
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.includes('.') // Static files like .ico, .png, etc.
  ) {
    return NextResponse.next()
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
