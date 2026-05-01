'use client'

import { useState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(formData: FormData) {
        setIsLoading(true)
        setError('')

        const result = await loginAction(formData)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
            return
        }

        // Redirect theo phân quyền
        if (result.role === 'ADMIN') {
            router.push('/dashboard')
        } else if (result.role === 'TECH') {
            router.push('/maintenance')
        } else if (result.role === 'OPERATOR') {
            router.push('/production')
        } else {
            // Không có role hoặc mặc định
            router.push('/')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[var(--mcs-bg)]">
            <div className="bg-white p-8 rounded shadow-sm border border-[var(--mcs-border)] max-w-sm w-full">
                <h1 className="text-xl font-bold text-center mb-6 text-[var(--mcs-primary)]">YSDMS Đăng Nhập</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <form action={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-[var(--mcs-primary)]"
                            defaultValue="admin@ysd-pack.co.jp"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-[var(--mcs-primary)]"
                            defaultValue="123456"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full bg-[var(--mcs-primary)] hover:bg-[#1a8c8c] text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>

            <div className="mt-8 text-xs text-gray-400">
                <p>Nội bộ xưởng YSD. Tài khoản vui lòng liên hệ Admin.</p>
            </div>
        </div>
    )
}
