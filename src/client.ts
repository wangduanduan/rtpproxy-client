import dgram from 'node:dgram'
import { Cookie, parseBuf, msg2Buf } from './util'

interface busCB {
    ts: number
    cb: Function
}

export class ClientBase {
    protected so: dgram.Socket
    protected ctrl: AbortController
    protected bus: Map<string, busCB>
    protected timeId: NodeJS.Timer
    protected timeMS: number
    constructor() {
        this.bus = new Map()
        this.ctrl = new AbortController()
        const { signal } = this.ctrl
        this.so = dgram.createSocket({ type: 'udp4', signal })

        this.so.on('message', this.onMessage)
        this.so.on('close', this.onClose)
        this.so.on('error', this.onError)
        this.so.on('listening', this.onListening)
        this.so.on('connect', this.onConnect)
        this.timeMS = 1000
        this.timeId = setInterval(this.cbCleaner, this.timeMS)
    }
    protected onClose() {}
    protected onError() {}
    protected onListening() {}
    protected onMessage(msg: Buffer, rinfo: dgram.RemoteInfo) {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
        const res = parseBuf(msg)
        const it = this.bus.get(res.cookie)
        if (it) {
            it.cb(res.body)
        }
    }
    protected onConnect() {}
    protected cbCleaner() {
        const now = new Date().valueOf()

        for (const [k, v] of this.bus) {
            let dis = now - v.ts
            if (dis > 500) {
                // timeout
                v.cb(new Error('TIMEOUT'))
            }
        }
    }
    // 向远程发送udp消息
    protected send(msg: string, port: number, ip: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let cookie = Cookie()

            this.so.send(msg2Buf(cookie, msg), port, ip, (err) => {
                reject(err)
            })

            this.bus.set(cookie, {
                ts: new Date().valueOf(),
                cb: (err: Error | undefined, msg: any) => {
                    this.bus.delete(cookie)

                    if (err) {
                        reject()
                    } else {
                        resolve(msg)
                    }
                },
            })
        })
    }
    protected abort() {
        this.ctrl.abort()
    }
}
