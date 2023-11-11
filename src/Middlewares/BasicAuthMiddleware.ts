import auth from 'basic-auth'
import { type Request, type Response, type NextFunction } from 'express'

export class BasicAuthMiddleware {
    public basicAuth = () => {
        return (req: Request, res: Response, next: NextFunction) => {
            var user = auth(req)
            if (!user || !process.env.AUTH_NAME || process.env.AUTH_PASSWORD !== user.pass) {
                res.set('WWW-Authenticate', 'Basic realm="First Layer Authentication"')
                return res.status(401).send()
            }
            next()
        }
    }
}
