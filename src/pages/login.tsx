import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
    const router = useRouter()
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: any) =>
            await axios.post('/api/login', {
                email,
                password,
            }),
        onSuccess: () => {
            console.log('Logged in')
            router.push('/')
        },
        onError: (error) => {
            console.error('Login error:', error)
        },
    })

    const login = (e: any) => {
        e.preventDefault()
        loginMutation.mutate({
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <form onSubmit={login} className='space-y-4'>
                    <h2 className='text-center text-2xl font-semibold'>
                        Log In
                    </h2>
                    <div>
                        <label htmlFor='email' className='block text-sm'>
                            Email(=id)
                        </label>
                        <input
                            type='text'
                            id='email'
                            name='email'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className='block text-sm'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2'
                    >
                        Log In
                    </button>
                </form>
                <div className='mt-4 text-center'>
                    <Link href='/forgotPassword' className='text-blue-600'>
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    )
}
