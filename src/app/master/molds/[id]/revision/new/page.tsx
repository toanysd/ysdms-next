import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MoldRevisionForm } from '../../../_components/MoldRevisionForm'
import { suggestNextRevisionLabel } from '@/app/actions/mold'

type Props = {
  params: Promise<{ id: string }>
}

export default async function NewMoldRevisionPage({ params }: Props) {
  const { id } = await params
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

  // Suggest next label
  const suggestedLabel = await suggestNextRevisionLabel(id)

  return (
    <MoldRevisionForm 
      moldBaseId={moldBase.product_id} 
      moldBaseCode={moldBase.product_code} 
      suggestedLabel={suggestedLabel}
    />
  )
}
