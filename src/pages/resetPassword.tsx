import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function ResetPassword() {
    const router = useRouter()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    // Extract token and email from query
    const { resetCode, email } = router.query

    const resetPasswordMutation = useMutation({
        mutationFn: async () =>
            await axios.post('/api/resetPassword', {
                email,
                newPassword,
                resetCode, // Send the resetCode in the body, not the URL
            }),
        onSuccess: () => {
            router.push('/login')
        },
        onError: () => {
            setError('Failed to reset the password. Please try again.')
        },
    })

    const handleResetPassword = (e: any) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        resetPasswordMutation.mutate()
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <h2 className='text-center text-2xl font-semibold mb-4'>
                    Reset Password
                </h2>
                <form onSubmit={handleResetPassword} className='space-y-4'>
                    <div>
                        <label htmlFor='newPassword' className='block text-sm'>
                            New Password
                        </label>
                        <input
                            type='password'
                            id='newPassword'
                            name='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='mt-1 block w-full'
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='confirmPassword'
                            className='block text-sm'
                        >
                            Confirm Password
                        </label>
                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='mt-1 block w-full'
                            required
                        />
                    </div>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
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
