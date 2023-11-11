import { config as Config } from 'dotenv'
import EventEmitter from 'events'
import type TypedEventEmmiter from 'typed-emitter'
import Baileys, { DisconnectReason, type WACallEvent, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import { Server } from './Server'
import { type client } from '../Types'
import { type IConfig } from '../Types/Config'
import { type Boom } from '@hapi/boom'
import { AuthenticationFromDatabase } from './Auth'
import qr from 'qr-image'
import connectDatabase from '../Database/config'

export class Client extends (EventEmitter as new () => TypedEventEmmiter<Events>) {
    private client!: client
    constructor() {
        super()
        Config()
        this.config = {
            name: process.env.NAME || 'API',
            session: process.env.SESSION || 'SESSION',
            PORT: parseInt(process.env.PORT || '3000')
        }
        new Server(this)
        connectDatabase.authenticate()
    }

    public start = async (): Promise<client> => {
        connectDatabase.authenticate()
        const { useDatabaseAuth } = new AuthenticationFromDatabase(this.config.session)
        const { saveState, state, clearState } = await useDatabaseAuth()
        const { version } = await fetchLatestBaileysVersion()
        this.client = Baileys({
            version,
            printQRInTerminal: true,
            auth: state,
            // logger: P({ level: 'fatal' }),
            browser: ['Firefox (FreeBSD)', 'fatal', '4.0.0'],
            getMessage: async (key) => {
                return {
                    conversation: ''
                }
            },
            markOnlineOnConnect: false
        })
        const result = (Object.keys(this.client) as Array<keyof typeof this.client>).reduce(
            (acc, key) => ({
                ...acc,
                [key]: this.client[key]
            }),
            this
        )
        Object.assign(this, result)
        this.ev.on('connection.update', (update: any) => {
            if (update.qr) {
                this.log(
                    `QR code generated. Scan it to continue | You can also authenticate in http://localhost:${this.config.PORT}`
                )
                this.QR = qr.imageSync(update.qr)
            }
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                    this.log('Reconnecting...')
                    setTimeout(async () => await this.start(), 3000)
                } else {
                    this.log('Disconnected.', true)
                    this.log('Deleting session and restarting')
                    clearState()
                    this.log('Session deleted')
                    this.log('Starting...')
                    setTimeout(async () => await this.start(), 3000)
                }
            }
            if (connection === 'connecting') {
                this.condition = 'connecting'
                this.log('Connecting to WhatsApp...')
            }
            if (connection === 'open') {
                this.condition = 'connected'
                this.log('Connected to WhatsApp')
            }
        })
        this.ev.on('creds.update', saveState)
        return this.client
    }

    public config: IConfig
    public log = (text: string, error: boolean = false): void => {
        console.log(error ? 'ERROR' : 'OK', `[${this.config.name.toUpperCase()}]`, text)
    }

    public ev!: client['ev']

    public QR!: Buffer
    public condition!: 'connected' | 'connecting' | 'logged_out'
    public sendMessage!: client['sendMessage']
}

type Events = {
    new_call: (call: WACallEvent) => void
}
