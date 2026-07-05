// @ts-nocheck
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

  // Verify the mold_base exists
  const { data: moldBase } = await supabase
    .from('mold_base')
    .select('id, code, name')
    .eq('id', id)
    .single()

  if (!moldBase) {
    notFound()
  }

  // Suggest next label
  const suggestedLabel = await suggestNextRevisionLabel(id)

  return (
    <MoldRevisionForm 
      moldBaseId={moldBase.id} 
      moldBaseCode={moldBase.code} 
      suggestedLabel={suggestedLabel}
    />
  )
}
