import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Todo {
    idx: number
    title: string
    content: string
    isDone: boolean
    createdAt: string
    updatedAt: string
}

// 사용자 정보 요청
const fetchMe = async () => {
    const response = await axios.get('/api/me')
    return response.data
}

// Todo 목록 요청
const fetchTodos = async () => {
    const response = await axios.get('/api/todos')
    return response.data
}

// 새로운 Todo 추가
const createTodo = async (newTodo: { title: string; content: string }) => {
    const response = await axios.post('/api/todos', newTodo)
    return response.data
}

export default function Todos() {
    const router = useRouter()

    const me = useQuery({ queryKey: ['me'], queryFn: fetchMe })

    const todosQuery = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

    const createTodoMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            todosQuery.refetch() // Todo 목록을 갱신
        },
    })

    const [newTodo, setNewTodo] = useState<{ title: string; content: string }>({
        title: '',
        content: '',
    })

    const handleCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createTodoMutation.mutate(newTodo) // 새로운 Todo 추가
        setNewTodo({ title: '', content: '' }) // 입력 필드 초기화
    }

    const handleLogout = async () => {
        await axios.post('/api/logout')
        router.push('/login')
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <p className='text-center text-2xl font-semibold mb-6 text-gray-800'>
                    Your Todos
                </p>
                <button
                    onClick={handleLogout}
                    className='bg-red-600 text-white py-2 rounded'
                >
                    Log Out
                </button>
                <div className='mt-6'>
                    <form onSubmit={handleCreateTodo}>
                        <input
                            type='text'
                            placeholder='Title'
                            value={newTodo.title}
                            onChange={(e) =>
                                setNewTodo({
                                    ...newTodo,
                                    title: e.target.value,
                                })
                            }
                            className='w-full p-2 mb-2 border border-gray-300 rounded'
                        />
                        <textarea
                            placeholder='Content'
                            value={newTodo.content}
                            onChange={(e) =>
                                setNewTodo({
                                    ...newTodo,
                                    content: e.target.value,
                                })
                            }
                            className='w-full p-2 mb-2 border border-gray-300 rounded'
                        />
                        <button
                            type='submit'
                            className='w-full bg-green-600 text-white py-2 rounded'
                        >
                            Add Todo
                        </button>
                    </form>
                </div>
                <div className='mt-6'>
                    {todosQuery.isLoading ? (
                        <p>Loading todos...</p>
                    ) : todosQuery.isError ? (
                        <p>Error loading todos</p>
                    ) : (
                        <ul>
                            {todosQuery.data?.map((todo: Todo) => (
                                <li
                                    key={todo.idx}
                                    className='p-2 border border-gray-300 rounded mb-2'
                                >
                                    <h3 className='font-semibold'>
                                        {todo.title}
                                    </h3>
                                    <p>{todo.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
