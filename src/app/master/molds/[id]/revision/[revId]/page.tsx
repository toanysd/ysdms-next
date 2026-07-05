// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MoldRevisionForm } from '../../../_components/MoldRevisionForm'

type Props = {
  params: Promise<{ id: string, revId: string }>
}

export default async function EditMoldRevisionPage({ params }: Props) {
  const { id, revId } = await params
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

  // Fetch the specific revision
  const { data: revision } = await supabase
    .from('mold_design_revision')
    .select('*')
    .eq('id', revId)
    .eq('mold_base_id', id)
    .single()

  if (!revision) {
    notFound()
  }

  return (
    <MoldRevisionForm 
      initialData={revision}
      moldBaseId={moldBase.id} 
      moldBaseCode={moldBase.code} 
    />
  )
}
