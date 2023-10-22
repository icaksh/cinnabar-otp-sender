import OneTimePasswordController from '../Controllers/OneTimePasswordController'
import SendMessageController from '../Controllers/SendMessageController'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class SendMessageRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly smc: SendMessageController = new SendMessageController(this.client)

    protected routes(): void {
        this.router.post('/:phoneNumber', this.smc.sendMessage)
    }
}
