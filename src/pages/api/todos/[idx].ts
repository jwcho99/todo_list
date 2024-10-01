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

    const { id } = req.query as { id: string }

    if (req.method === 'GET') {
        // Get a specific todo
        const todo = await prisma.todo.findUnique({
            where: { idx: parseInt(id) },
            include: { tasks: true },
        })
        if (!todo || todo.userIdx !== user.idx) {
            return res.status(404).json({ message: 'Todo not found' })
        }
        return res.status(200).json(todo)
    } else if (req.method === 'PUT') {
        // Update a specific todo
        const { title, content, isDone } = req.body
        const todo = await prisma.todo.update({
            where: { idx: parseInt(id) },
            data: { title, content, isDone },
        })
        return res.status(200).json(todo)
    } else if (req.method === 'DELETE') {
        // Delete a specific todo
        await prisma.todo.delete({
            where: { idx: parseInt(id) },
        })
        return res.status(204).end()
    } else {
        return res.status(405).json({ message: 'Method not allowed' })
    }
}
