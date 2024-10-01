import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, nickname } = req.body
    if (
        email === undefined ||
        password === undefined ||
        nickname === undefined
    ) {
        return res
            .status(400)
            .json({ message: 'email,pw,nickname이 필요합니다.' })
    }
    // email이 겹치는게 있으면 불가능
    const isExist_email = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })
    if (isExist_email !== null) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
    }

    const isExist_nickname = await prisma.user.findUnique({
        where: {
            nickname: nickname,
        },
    })
    if (isExist_nickname !== null) {
        return res.status(400).json({ message: '이미 존재하는 닉네임입니다.' })
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
        data: {
            password: hashedPassword,
            email: email,
            nickname: nickname,
        },
    })

    res.status(200).json({
        status: 'success',
        idx: user.idx,
        email: user.email,
        nickname: user.nickname,
    })
}
