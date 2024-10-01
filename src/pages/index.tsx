/* import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: () => {
            me.refetch()
            window.location.reload()
        },
        onError: (error) => {
            console.error('Logout error:', error)
        },
    })

    const logout = () => logoutMutation.mutate()
    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <p className='text-center text-2xl font-semibold mb-6 text-gray-800'>
                    Welcome Back!
                </p>
                {me.data?.data ? (
                    <div>
                        <p className='text-center text-lg mb-4 text-gray-600'>
                            Logged in as:{' '}
                            <strong>{me.data?.data.nickname}</strong>
                        </p>
                        <div className='mt-4'>
                            <button
                                onClick={logout}
                                className='w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='space-y-4'>
                            <button
                                onClick={() => router.push('/signUp')}
                                className='w-full bg-green-600 text-white p-2'
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className='w-full bg-indigo-600 text-white p-2'
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => router.push('/forgotPassword')}
                                className='w-full bg-pink-600 text-white p-2'
                            >
                                Reset Password
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
 */

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()

    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await axios.get('/api/me')
            return response.data
        },
    })

    // 로그인된 사용자의 경우 자동으로 Todo 페이지로 리디렉션
    if (me.isLoading) {
        return <p>Loading...</p>
    }

    if (me.data) {
        router.push('/todos') // Todo 페이지로 리디렉션
        return null // 리디렉션 중 다른 내용을 반환하지 않습니다.
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <p className='text-center text-2xl font-semibold mb-6 text-gray-800'>
                    Welcome Back!
                </p>
                <div className='space-y-4'>
                    <button
                        onClick={() => router.push('/signUp')}
                        className='w-full bg-green-600 text-white p-2'
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => router.push('/login')}
                        className='w-full bg-indigo-600 text-white p-2'
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => router.push('/forgotPassword')}
                        className='w-full bg-pink-600 text-white p-2'
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    )
}
