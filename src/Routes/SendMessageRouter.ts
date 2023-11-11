import { SendMessageController } from '../Controllers'
import { ApiKeyMiddleware } from '../Middlewares'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class SendMessageRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly smc: SendMessageController = new SendMessageController(this.client)
    private readonly api: ApiKeyMiddleware = new ApiKeyMiddleware()
    protected routes(): void {
        this.router.post('/:phoneNumber', this.api.checkApiKey(), this.smc.sendMessage)
    }
}
