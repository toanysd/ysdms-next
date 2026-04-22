'use server'

import { createClient } from '@/lib/supabase/server'

export interface ProcessTag {
    id: string
    label: string
    display_text: string
    category: string
}

export async function getProcessTagsAction(): Promise<{ system: ProcessTag[], custom: ProcessTag[] }> {
    const supabase = await createClient()

    // 1. System Tags
    const { data: systemTags, error: sysErr } = await supabase
        .from('process_tag_master')
        .select('*')
        .eq('is_active', true)
        .in('category', ['process', 'packaging'])
        .order('sort_order', { ascending: true })

    // 2. Custom Tags
    const { data: customTags, error: custErr } = await supabase
        .from('process_tag_master')
        .select('*')
        .eq('is_active', true)
        .eq('category', 'custom')
        .order('created_at', { ascending: false })

    if (sysErr || custErr) {
        console.error('Error fetching tags:', sysErr || custErr)
        return { system: [], custom: [] }
    }
    return { system: systemTags || [], custom: customTags || [] }
}

export async function addCustomTagAction(label: string, displayText: string): Promise<ProcessTag> {
    const supabase = await createClient()

    // Yêu cầu user hiện hành cho Custom Tags
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) throw new Error('Yêu cầu đăng nhập để tạo Tag tùy chỉnh')

    const { data, error } = await supabase
        .from('process_tag_master')
        .insert([{
            label,
            display_text: displayText,
            category: 'custom',
            created_by: user.id
        }])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }
    return data
}
