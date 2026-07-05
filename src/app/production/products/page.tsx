import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductsClientPage from './_components/ProductsClientPage'

export const metadata = {
  title: 'Quản lý Khay (Sản phẩm) | YSDMS Next-Gen',
}

export const revalidate = 0

export default async function ProductsPage() {
  const supabase = await createClient()

  const [
    { data: customers },
    { data: plasticTypes },
    { data: productsData }
  ] = await Promise.all([
    supabase.from('companies').select('company_id, company_name, company_code').order('company_name').limit(100),
    supabase.from('materials').select('material_id, material_code, material_type, thickness_mm, width_mm').order('material_code'),
    supabase.from('products').select(`
      product_id, product_code, product_name, product_name_internal, updated_at,
      companies (company_code)
    `).order('updated_at', { ascending: false }).limit(100)
  ])

  return (
    <ProductsClientPage 
      customers={customers || []} 
      plasticTypes={plasticTypes || []} 
      initialProducts={productsData || []}
    />
  )
}
