import OneTimePasswordController from '../Controllers/OneTimePasswordController'
import {ValidatorMiddleware} from '../Middlewares/Validator'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class OneTimePasswordRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly otp: OneTimePasswordController = new OneTimePasswordController(this.client)
    private readonly validator: ValidatorMiddleware = new ValidatorMiddleware()
    protected routes(): void {
        this.router.get('/', this.validator.validateQuery('getOTP'), this.otp.getOTP)
        this.router.post('/resend/', this.validator.validateBody('reqOTP'), this.otp.resendOTP)
        this.router.post('/', this.validator.validateBody('reqOTP'), this.otp.requestOTP)
        this.router.put('/', this.validator.validateBody('useOTP'), this.otp.useOTP)
        this.router.delete('/', this.validator.validateBody('reqOTP'), this.otp.delOTP)
    }
}
