'use server'

import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
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
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const rawEmail = formData.get('email') as string
  const email = rawEmail?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email) {
    return redirect('/login?error=Email is required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function adminLogin(formData: FormData) {
  const supabase = await createClient()

  const rawEmail = formData.get('email') as string
  const email = rawEmail?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email) {
    return redirect('/admin/login?error=Email is required')
  }

  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return redirect(`/admin/login?error=${encodeURIComponent(authError.message)}`)
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return redirect('/admin/login?error=Access denied. Admin privileges required.')
    }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || `https://${headersList.get('host')}`

  const rawEmail = formData.get('email') as string
  const email = rawEmail?.trim().toLowerCase()
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email) {
    return redirect('/login?error=Email is required')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  })

    if (error) {
      return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // Create or update profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: fullName,
          role: 'user',
        }, { onConflict: 'id' })
      
      if (profileError) {
          console.error('Profile creation error:', profileError)
      }
    }

    // If there's no session, it means email confirmation is enabled
    if (!data.session) {
      return redirect('/login?message=Check your email to confirm your account.')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
