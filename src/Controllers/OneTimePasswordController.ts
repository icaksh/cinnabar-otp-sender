import { config as Config } from 'dotenv'
import OneTimePasswordModel from '../Database/Models/OneTimePasswordModel'
import { type Request, type Response } from 'express'
import OneTimePasswordSchema from '../Schema/OneTimePasswordSchema'
import { type Client } from '../Structures'

export default class OneTimePasswordController {
    constructor(private readonly client: Client) {
        Config()
    }

    private readonly firstStatement = process.env.FIRST_STATEMENT || 'Your OTP Code is '
    private readonly lastStatement = process.env.LAST_STATEMENT || ' Keep Secret!'

    private readonly otpModel: OneTimePasswordModel = new OneTimePasswordModel()
    private readonly otpSchema: OneTimePasswordSchema = new OneTimePasswordSchema()

    private checkOTP = async (phoneNumber: string) => {
        const result = await this.otpModel.getOTPFromPhoneNumber(parseInt(phoneNumber))
        return result
    }

    public getOTP = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const otp = await this.checkOTP(phoneNumber)
        if (otp == null)
            return res.status(404).send({
                message: "phone number's not found"
            })
        return res.status(200).send({ otp: otp })
    }

    public requestOTP = async (req: Request, res: Response) => {
        const data = req.body
        const { error } = this.otpSchema.reqOTP.validate(data)
        const { phoneNumber } = data
        if (error)
            return res.status(400).send({
                message: error.details[0].message
            })
        const otp = this.checkOTP(phoneNumber.toString())
        if (otp == null)
            return res.status(406).send({
                message: "phone number's already have latest otp"
            })
        const latestOTP = await this.otpModel.getOTPFromPhoneNumber(parseInt(phoneNumber))
        const otpCode = Math.floor(100000 + Math.random() * 900000)
        await this.otpModel.createOTP(phoneNumber, otpCode)
        const result = await this.checkOTP(phoneNumber)
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: this.firstStatement + otpCode + this.lastStatement
        })
        return res.status(201).send(result)
    }

    public resendOTP = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const result = await this.otpModel.getOTPFromPhoneNumber(parseInt(phoneNumber!.toString()))
        if (result == null)
            return res.status(404).send({
                message: "phone number's not found"
            })
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: this.firstStatement + result.otpCode + this.lastStatement
        })
        return res.status(202).send({
            message: 'success resending otp code',
            info: result
        })
    }

    public useOTP = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const data = req.body
        const { error } = this.otpSchema.useOTP.validate(data)
        const { otpCode } = data
        if (error)
            return res.status(400).send({
                message: error.details[0].message
            })
        const latestOTP = await this.checkOTP(phoneNumber)
        if (latestOTP == null) {
            return res.status(404).send({
                message: "phone number's not found"
            })
        }
        if (!(latestOTP?.otpCode == otpCode)) {
            await this.otpModel.updateOTP(parseInt(phoneNumber), latestOTP!.attempt + 1, false)
            return res.status(401).send({
                message: 'wrong otp code'
            })
        }
        await this.otpModel.updateOTP(parseInt(phoneNumber), 5, true)
        return res.status(200).send({
            message: 'verification success'
        })
    }

    public delOTP = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const latestOTP = await this.checkOTP(phoneNumber)
        if (latestOTP == null) {
            return res.status(404).send({
                message: "phone number's otp not found"
            })
        }
        const query = await this.otpModel.deleteOTP(parseInt(phoneNumber))
        return res.status(200).send({
            message: 'delete success'
        })
    }
}
