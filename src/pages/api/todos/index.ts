import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { parseCookies } from 'nookies'
import { JWTPayload } from '@/pages/types/jwtPayload'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token } = parseCookies({ req })

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    let payload: JWTPayload
    try {
        payload = verify(token, process.env.JWT_SECRET) as JWTPayload
    } catch {
        return res.status(401).json({ message: 'Invalid token' })
    }

    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    if (req.method === 'GET') {
        // Get all todos
        const todos = await prisma.todo.findMany({
            where: { userIdx: user.idx },
            include: { tasks: true },
        })
        return res.status(200).json(todos)
    } else if (req.method === 'POST') {
        // Create a new todo
        const { title, content } = req.body
        const todo = await prisma.todo.create({
            data: {
                title,
                content,
                isDone: false,
                userIdx: user.idx,
            },
        })
        return res.status(201).json(todo)
    } else {
        return res.status(405).json({ message: 'Method not allowed' })
    }
}
