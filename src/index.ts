import { ClientBase } from './client'

interface Params {
    SDP?: string
    callID: string
    fromTag: string
    toTag?: string
}

class RTPProxyClient extends ClientBase {
    constructor() {
        super()
    }

    // 删除 delete
    // C_DELETE = "D" [ DELETE_WEAK ] SEP CALLID SEP FROM_TAG [ SEP TO_TAG ]
    // 199_7914_25 D 06d63c60-cca1-123c-448e-00505689b99b Ua0mZXU75Ka1c 0d2e5d4f50d0a358
    deleteStream(p: Params, port: number, ip: string) {
        return this.send(`D ${p.callID} ${p.fromTag}`, port, ip)
    }

    recordStream() {}
    startPlayback() {}
    stopPlayback() {}
    copyStream() {}

    // 创建，offer
    // C_UPDATE = "U" [ UPDATE_LOOKUP_PARAMS ] SEP CALLID REMOTE_IP SEP REMOTE_PORT SEP FROM_TAG [ SEP TO_TAG ]  [ SEP NOTIFY_SOCKET SEP NOTIFY_TAG ]
    // 202_2030_26 Uc8,0,101 06d63c60-cca1-123c-448e-00505689b99b 1.2.3.4 18856 Ua0mZXU75Ka1c;1
    createSession(p: Params, port: number, ip: string) {
        const mIP = ''
        const mPort = 0
        return this.send(`U ${p.callID} ${p.fromTag} ${mIP} ${mPort} ${p.fromTag};1`, port, ip)
    }

    // 更新， answer
    // C_LOOKUP = "L" [ UPDATE_LOOKUP_PARAMS ] SEP CALLID REMOTE_IP SEP REMOTE_PORT SEP FROM_TAG [ SEP TO_TAG ]
    // 202_2030_27 Lc8,101 06d63c60-cca1-123c-448e-00505689b99b 1.2.3.4 34810 Ua0mZXU75Ka1c;1 0d2e5d4f50d0a358;1
    lookupSession(p: Params, port: number, ip: string) {
        const mIP = ''
        const mPort = 0
        return this.send(`L ${p.callID} ${p.fromTag} ${mIP} ${mPort} ${p.fromTag};1 ${p.toTag};1`, port, ip)
    }

    getInformation() {}
    queryStreamInfo() {}
    getFeatures() {}
    getBaseVersion() {}
    deleteAllSessions() {}
    getStatistics() {}
}
