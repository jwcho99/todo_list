export interface JWTPayload {
    email: string
    nickname: string
    idx: number
    createAt: string | Date
    updateAt: string | Date
}
