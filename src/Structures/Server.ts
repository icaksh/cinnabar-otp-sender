import express from 'express'
import { join } from 'path'
import { type Client } from '.'
import expressPino from 'express-pino-logger'
import { OneTimePasswordRouter } from '../Routes/OneTimePasswordRouter'
import { AuthenticationRouter } from '../Routes/AuthenticationRouter'
import { SendMessageRouter } from '../Routes/SendMessageRouter'

export class Server {
    constructor(private readonly client: Client) {
        this.app.use(express.json())
        this.app.use('/otp', new OneTimePasswordRouter(client).router)
        this.app.use('/auth', new AuthenticationRouter(client).router)
        this.app.use('/message', new SendMessageRouter(client).router)
        const pinos = expressPino({
            level: 'debug'
        })

        this.app.use(pinos)

        this.app.all('*', (req, res) => res.sendStatus(404))

        this.app.listen(client.config.PORT, () => {
            client.log(`Server started on PORT : ${client.config.PORT}`)
        })
    }

    private readonly app = express()
}
