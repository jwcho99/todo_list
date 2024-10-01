import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function ForgotPassword() {
    const router = useRouter()

    const forgotPasswordMutation = useMutation({
        mutationFn: async ({ email }: any) =>
            await axios.post('/api/requestReset', {
                email,
            }),
        onSuccess: (_, email) => {
            router.push({
                pathname: '/validateResetCode',
                query: { email },
            })
        },
        onError: (error) => {
            console.error('Forgot password error:', error)
        },
    })

    const handleForgotPassword = (e: any) => {
        e.preventDefault()
        forgotPasswordMutation.mutate({
            email: e.currentTarget.email.value,
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <form onSubmit={handleForgotPassword} className='space-y-4'>
                    <h2 className='text-center text-2xl font-semibold'>
                        Forgot Password
                    </h2>
                    <div>
                        <label htmlFor='email' className='block text-sm'>
                            Email
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2'
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}
