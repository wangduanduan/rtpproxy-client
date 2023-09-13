import { nanoid } from 'nanoid'
const cookieLen = 21

export const Cookie = nanoid

export function parseBuf(buf: Buffer) {
    const s = buf.toString()
    return {
        cookie: s.substring(0, cookieLen),
        body: s.substring(cookieLen + 1),
    }
}

export function msg2Buf(cookie: string, body: string) {
    return Buffer.from(`${cookie} ${body}`)
}
