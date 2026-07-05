'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (authError || !authData.user) {
        return { error: 'Đăng nhập thất bại: ' + authError?.message }
    }

    // Lấy Role sau khi đăng nhập
    // Note: user_roles table may not be in generated types yet
    const { data: roleData } = await (supabase as any)
        .from('user_roles')
        .select('role_name')
        .eq('user_id', authData.user.id)
        .single()

    const role = (roleData as any)?.role_name

    return { success: true, role }
}

export async function logoutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
