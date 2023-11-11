import { SendMessageController } from '../Controllers'
import { ApiKeyMiddleware, ValidatorMiddleware } from '../Middlewares'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class SendMessageRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly smc: SendMessageController = new SendMessageController(this.client)
    private readonly validator: ValidatorMiddleware = new ValidatorMiddleware()
    private readonly api: ApiKeyMiddleware = new ApiKeyMiddleware()
    protected routes(): void {
        this.router.post('/', this.api.checkApiKey(), this.validator.validateBody('sendMessage'), this.smc.sendMessage)
    }
}
