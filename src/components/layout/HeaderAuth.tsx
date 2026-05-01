import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions/auth'

export default async function HeaderAuth() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="ml-auto text-xs text-gray-500">
                <a href="/login" className="hover:underline">Đăng nhập</a>
            </div>
        )
    }

    // Lấy Role từ bảng
    const { data: roleData } = await supabase.from('user_roles').select('role_name').eq('user_id', user.id).single()
    const role = roleData?.role_name || 'NO_ROLE'

    let badgeColor = 'bg-gray-200 text-gray-800'
    if (role === 'ADMIN') badgeColor = 'bg-red-100 text-red-800 border-red-200'
    else if (role === 'OPERATOR') badgeColor = 'bg-blue-100 text-blue-800 border-blue-200'
    else if (role === 'TECH') badgeColor = 'bg-orange-100 text-orange-800 border-orange-200'

    return (
        <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end leading-tight">
                <span className="text-xs text-gray-500">{user.email}</span>
            </div>

            <div className={`px-2 py-0.5 text-[10px] font-bold rounded border ${badgeColor}`}>
                {role}
            </div>

            <form action={logoutAction}>
                <button type="submit" className="text-xs text-gray-500 hover:text-red-600 px-2 border-l border-gray-300 ml-2">
                    Thoát
                </button>
            </form>
        </div>
    )
}
