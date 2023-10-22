import { join } from 'path'
import OneTimePasswordController from '../Controllers/OneTimePasswordController'
import { type Client } from '../Structures'
import express, { type Router } from 'express'

export class AuthenticationRouter {
    constructor(private readonly client: Client) {
        this.router = express.Router()
        this.routes()
    }

    public router: Router
    private readonly path = join(__dirname, '..', '..', 'static')

    protected routes(): void {
        this.router.use('/', express.static(this.path))
        this.router.get('/qr', async (req, res) => {
            const { session } = req.query
            if (!session || !this.client || this.client.config.session !== (req.query.session as string)) {
                return void res.status(404).setHeader('Content-Type', 'text/plain').send('Invalid Session').end()
            }
            if (!this.client?.QR) {
                return void res
                    .status(404)
                    .setHeader('Content-Type', 'text/plain')
                    .send(
                        this.client.condition === 'connected'
                            ? 'You are already connected to WhatsApp'
                            : 'QR not generated'
                    )
                    .end()
            }
            res.status(200).contentType('image/png').send(this.client.QR)
        })
    }

}



