import { config as Config } from 'dotenv'
import { OneTimePasswordModel } from '../Database/Models'
import { type Request, type Response } from 'express'
import { type Client } from '../Structures'
import { Op } from '@sequelize/core'

export default class OneTimePasswordController {
    constructor(private readonly client: Client) {
        Config()
    }

    private readonly firstStatement = process.env.FIRST_STATEMENT || 'Your OTP Code is '
    private readonly lastStatement = process.env.LAST_STATEMENT || ' Keep Secret!'

    private readonly otp = OneTimePasswordModel

    public getOTP = async (req: Request, res: Response): Promise<Response> => {
        const data = req.query
        const { phoneNumber } = data
        const otp = await this.getOTPFromNumber(parseInt(phoneNumber as string))
        if (otp == null) {
            return res.status(404).send({
                message: 'phone number dont have otp code or otp has been expired'
            })
        }
        return res.status(200).send({ otp })
    }

    public requestOTP = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body
        const { phoneNumber } = data
        const otp = await this.getOTPFromNumber(phoneNumber)
        if (otp != null) {
            return res.status(406).send({
                message: 'phone number already have latest otp'
            })
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000)
        await this.createOTP(phoneNumber, otpCode)
        const result = await this.getOTPFromNumber(phoneNumber)
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: this.firstStatement + otpCode + this.lastStatement
        })
        return res.status(201).send(result)
    }

    public resendOTP = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body
        const { phoneNumber } = data
        const result = await this.getOTPFromNumber(phoneNumber)
        if (result == null) {
            return res.status(404).send({
                message: 'phone number dont have otp code or otp has been expired'
            })
        }
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: this.firstStatement + result.otpCode + this.lastStatement
        })
        return res.status(202).send({
            message: 'success resending otp code',
            info: result
        })
    }

    public useOTP = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body
        const { phoneNumber, otpCode } = data
        const latestOTP = await this.getOTPFromNumber(phoneNumber)
        if (latestOTP == null) {
            return res.status(404).send({
                message: 'phone number dont have otp code or otp has been expired'
            })
        }
        if (!(latestOTP?.otpCode == otpCode)) {
            await this.updateOTP(parseInt(phoneNumber), latestOTP.attempt + 1, false)
            return res.status(401).send({
                message: 'wrong otp code'
            })
        }
        await this.updateOTP(parseInt(phoneNumber), 5, true)
        return res.status(200).send({
            message: 'verification success',
            info: latestOTP
        })
    }

    public delOTP = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body
        const { phoneNumber } = data
        const latestOTP = await this.getOTPFromNumber(phoneNumber)
        if (latestOTP == null) {
            return res.status(404).send({
                message: "phone number's otp not found"
            })
        }
        const query = await this.deleteOTP(parseInt(phoneNumber))
        return res.status(200).send({
            message: 'delete success'
        })
    }

    private readonly lifetime = parseInt(process.env.OTP_LIFETIME || '2')
    private readonly attempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '3')

    private readonly getOTPFromNumber = async (phoneNumber: number): Promise<OneTimePasswordModel | null> => {
        return await this.otp.findOne({
            where: {
                [Op.and]: [
                    { phoneNumber },
                    { isUsed: false },
                    { attempt: { [Op.lt]: this.attempts } },
                    { createdAt: { [Op.gte]: new Date(Date.now() - 60000 * this.lifetime) } }
                ]
            }
        })
    }

    private readonly createOTP = async (phoneNumber: number, otpCode: number): Promise<void> => {
        await this.otp.create({
            phoneNumber,
            otpCode,
            attempt: 0,
            isUsed: false
        })
    }

    private readonly updateOTP = async (phoneNumber: number, attempt: number, isUsed: boolean): Promise<void> => {
        await this.otp.update(
            {
                attempt,
                isUsed
            },
            {
                where: {
                    [Op.and]: [
                        { phoneNumber },
                        { isUsed: false },
                        { attempt: { [Op.lte]: this.attempts } },
                        { createdAt: { [Op.gte]: new Date(Date.now() - 60000 * 2) } }
                    ]
                }
            }
        )
    }

    private readonly deleteOTP = async (phoneNumber: number): Promise<void> => {
        await this.otp.destroy({
            where: {
                phoneNumber
            }
        })
    }
}
