import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MoldRevisionForm } from '../../../_components/MoldRevisionForm'

type Props = {
  params: Promise<{ id: string, revId: string }>
}

export default async function EditMoldRevisionPage({ params }: Props) {
  const { id, revId } = await params
  const supabase = await createClient()

  // Verify the product exists
  const { data: moldBase } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal')
    .eq('product_id', id)
    .single()

  if (!moldBase) {
    notFound()
  }

  // Fetch the specific revision
  const { data: revision } = await supabase
    .from('design_revisions')
    .select('*')
    .eq('revision_id', revId)
    .eq('product_id', id)
    .single()

  if (!revision) {
    notFound()
  }

  return (
    <MoldRevisionForm 
      initialData={revision}
      moldBaseId={moldBase.product_id} 
      moldBaseCode={moldBase.product_code} 
    />
  )
}
