import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function ValidateResetCode() {
    const router = useRouter()
    const { email } = router.query

    const validateResetCode = useMutation({
        mutationFn: async ({ email, resetCode }: any) =>
            await axios.post('/api/validateResetCode', {
                email,
                resetCode,
            }),
        onSuccess: (_, { resetCode }) => {
            router.push({
                pathname: '/resetPassword',
                query: { email, resetCode },
            })
        },
        onError: (error) => {
            console.error('Validation error:', error)
        },
    })

    const handleResetCode = (e: any) => {
        e.preventDefault()
        validateResetCode.mutate({
            email,
            resetCode: e.currentTarget.resetCode.value,
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <form onSubmit={handleResetCode} className='space-y-4'>
                    <h2 className='text-center text-2xl font-semibold'>
                        Validate Code
                    </h2>
                    <div>
                        <label htmlFor='resetCode' className='block text-sm'>
                            Code
                        </label>
                        <input
                            type='text'
                            id='resetCode'
                            name='resetCode'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2'
                    >
                        Confirm Code
                    </button>
                </form>
            </div>
        </div>
    )
}
