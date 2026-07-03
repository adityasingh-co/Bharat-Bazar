'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category_id = formData.get('category_id') as string
  const image_url = formData.get('image_url') as string
  
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  const { error } = await supabase.from('products').insert({
    name,
    description,
    price,
    stock,
    category_id,
    image_url,
    slug
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category_id = formData.get('category_id') as string
  const image_url = formData.get('image_url') as string
  
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  const { error } = await supabase.from('products').update({
    name,
    description,
    price,
    stock,
    category_id,
    image_url,
    slug
  }).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
}
