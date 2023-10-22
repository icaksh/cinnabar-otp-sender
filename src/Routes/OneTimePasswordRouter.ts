import OneTimePasswordController from '../Controllers/OneTimePasswordController'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class OneTimePasswordRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly otp: OneTimePasswordController = new OneTimePasswordController(this.client)

    protected routes(): void {
        this.router.get('/:phoneNumber', this.otp.getOTP)
        this.router.get('/resend/:phoneNumber', this.otp.resendOTP)
        this.router.post('/', this.otp.requestOTP)
        this.router.put('/:phoneNumber', this.otp.useOTP)
        this.router.delete('/:phoneNumber', this.otp.delOTP)
    }
}
