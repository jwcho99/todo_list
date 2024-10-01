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

    const { id } = req.query as { id: string }

    if (req.method === 'GET') {
        // Get a specific task
        const task = await prisma.task.findUnique({
            where: { idx: parseInt(id) },
        })
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }
        return res.status(200).json(task)
    } else if (req.method === 'PUT') {
        // Update a specific task
        const { title, content, status } = req.body
        const task = await prisma.task.update({
            where: { idx: parseInt(id) },
            data: { title, content, status },
        })
        return res.status(200).json(task)
    } else if (req.method === 'DELETE') {
        // Delete a specific task
        await prisma.task.delete({
            where: { idx: parseInt(id) },
        })
        return res.status(204).end()
    } else {
        return res.status(405).json({ message: 'Method not allowed' })
    }
}
