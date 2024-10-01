import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'
import { setCookie } from 'nookies'

const prisma = new PrismaClient()

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const { email, password } = req.body
            if (!email || !password) {
                console.error('Missing email or password')
                return res
                    .status(400)
                    .json({ message: 'email, password 필요합니다.' })
            }
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            })
            if (user === null) {
                console.error('No user found for email:', email)
                return res
                    .status(400)
                    .json({ message: 'id에 해당하는 유저가 없습니다.' })
            }
            const hashedPassword = user.password
            const isCollect = await compare(password, hashedPassword)
            if (!isCollect) {
                console.error('Password does not match for email:', email)
                return res
                    .status(400)
                    .json({ message: '비밀번호가 일치하지 않습니다.' })
            }
            const payload = {
                email: user.email,
                nickname: user.nickname,
                idx: user.idx,
                createAt: user.createdAt,
                updateAt: user.updatedAt,
            }

            const token = await sign(
                payload,
                process.env.JWT_SECRET as string,
                {
                    expiresIn: '1h',
                }
            )

            setCookie({ res }, 'token', token, {
                maxAge: 60 * 60, // 1 hour
                path: '/', // Cookie path
                httpOnly: true, // Cannot be accessed by JavaScript
                secure: false, // Only sent over HTTPS
            })
            return res.status(200).json({ status: 'success' })
        } else {
            console.error('Unsupported method:', req.method)
            return res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: '서버 에러',
        })
    }
}

export default loginUser
