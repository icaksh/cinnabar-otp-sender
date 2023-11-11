import { OneTimePasswordController } from '../Controllers'
import { ApiKeyMiddleware, ValidatorMiddleware } from '../Middlewares'
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
    private readonly api: ApiKeyMiddleware = new ApiKeyMiddleware()
    protected routes(): void {
        this.router.get('/', this.api.checkApiKey(), this.validator.validateQuery('getOTP'), this.otp.getOTP)
        this.router.post('/resend/', this.api.checkApiKey(), this.validator.validateBody('reqOTP'), this.otp.resendOTP)
        this.router.post('/', this.api.checkApiKey(), this.validator.validateBody('reqOTP'), this.otp.requestOTP)
        this.router.put('/', this.api.checkApiKey(), this.validator.validateBody('useOTP'), this.otp.useOTP)
        this.router.delete('/', this.api.checkApiKey(), this.validator.validateBody('reqOTP'), this.otp.delOTP)
    }
}
