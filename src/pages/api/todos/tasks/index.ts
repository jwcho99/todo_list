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

    let payload
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

    const { todoId } = req.query as { todoId: string }

    if (req.method === 'GET') {
        // Get all tasks for a todo
        const tasks = await prisma.task.findMany({
            where: { todoIdx: parseInt(todoId) },
        })
        return res.status(200).json(tasks)
    } else if (req.method === 'POST') {
        // Create a new task
        const { title, content, status } = req.body
        const task = await prisma.task.create({
            data: {
                title,
                content,
                status,
                todoIdx: parseInt(todoId),
            },
        })
        return res.status(201).json(task)
    } else {
        return res.status(405).json({ message: 'Method not allowed' })
    }
}
