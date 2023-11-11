import {
    proto,
    BufferJSON,
    initAuthCreds,
    type AuthenticationCreds,
    type SignalDataTypeMap,
    type AuthenticationState
} from '@whiskeysockets/baileys'
import {SessionModel} from '../Database/Models'

export class AuthenticationFromDatabase {
    constructor(private readonly sessionId: string) {}

    public useDatabaseAuth = async (): Promise<{
        state: AuthenticationState
        saveState: () => Promise<void>
        clearState: () => Promise<void>
    }> => {
        let creds: AuthenticationCreds
        let keys: any = {}
        const storedCreds = await this.session.getSession(this.sessionId)
        if (storedCreds?.session) {
            const parsedCreds = JSON.parse(JSON.stringify(storedCreds.session), BufferJSON.reviver)
            creds = parsedCreds.creds
            keys = parsedCreds.keys
        } else {
            if (!storedCreds) await this.session.saveNewSession(this.sessionId)
            creds = initAuthCreds()
        }
        const saveState = async (): Promise<void> => {
            const session = JSON.stringify({ creds, keys }, BufferJSON.replacer, 2)
            await this.session.updateSession(this.sessionId, session)
        }
        const clearState = async (): Promise<void> => {
            await this.session.removeSession(this.sessionId)
        }
        return {
            state: {
                creds,
                keys: {
                    get: (type, ids) => {
                        const key = this.KEY_MAP[type]
                        return ids.reduce((dict: any, id) => {
                            let value = keys[key]?.[id]
                            if (value) {
                                if (type === 'app-state-sync-key') {
                                    value = proto.Message.AppStateSyncKeyData.fromObject(value)
                                }
                                dict[id] = value
                            }
                            return dict
                        }, {})
                    },
                    set: (data: any) => {
                        for (const _key in data) {
                            const key = this.KEY_MAP[_key as keyof SignalDataTypeMap]
                            keys[key] = keys[key] || {}
                            Object.assign(keys[key], data[_key])
                        }
                        saveState()
                    }
                }
            },
            saveState,
            clearState
        }
    }

    private readonly KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
        'pre-key': 'preKeys',
        session: 'sessions',
        'sender-key': 'senderKeys',
        'app-state-sync-key': 'appStateSyncKeys',
        'app-state-sync-version': 'appStateVersions',
        'sender-key-memory': 'senderKeyMemory'
    }

    private readonly session = new SessionModel()
}
