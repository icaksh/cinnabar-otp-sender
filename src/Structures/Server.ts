import express from 'express'
import { type Client } from '.'
import expressPino from 'express-pino-logger'
import { OneTimePasswordRouter } from '../Routes/OneTimePasswordRouter'
import { AuthenticationRouter } from '../Routes/AuthenticationRouter'
import { SendMessageRouter } from '../Routes/SendMessageRouter'

export class Server {
    constructor(private readonly client: Client) {
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
            next()
          })
        this.app.use(express.json())
        this.app.use((req, res, next) => { 
            const apiKey = req.get('API-Key')
            if (!apiKey || apiKey !== process.env.PRIVATE_API_KEY) {
                res.status(401).json({ message: 'unauthorized' })
            } else {
                next()
            }
        })
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
