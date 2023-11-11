import { type Request, type Response, type NextFunction } from 'express'
import validator from '../Validator'

export class ValidatorMiddleware {
    private readonly validators: any = validator
    public validateBody = (validator: any) => {
        if (!this.validators.hasOwnProperty(validator)) {
            throw new Error(`'${validator}' validator is not exist`)
        }
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const validated: any = await this.validators[validator].validateAsync(req.body)
                req.body = validated
                next()
            } catch (err: any) {
                if (err.isJoi) {
                    return res.status(422).send({ message: err.message })
                }
                return res.status(500)
            }
        }
    }

    public validateQuery = (validator: any) => {
        if (!this.validators.hasOwnProperty(validator)) {
            throw new Error(`'${validator}' validator is not exist`)
        }
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const validated: any = await this.validators[validator].validateAsync(req.query)
                req.params = validated
                next()
            } catch (err: any) {
                if (err.isJoi) {
                    return res.status(422).send({ message: err.message })
                }
                return res.status(500)
            }
        }
    }
}
