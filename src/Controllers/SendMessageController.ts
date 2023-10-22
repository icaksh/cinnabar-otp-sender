import { config as Config } from 'dotenv'
import { type Request, type Response } from 'express'
import { type Client } from '../Structures'
import SendMessageSchema from '../Schema/SendMessageSchema'

export default class SendMessageController {
    constructor(private readonly client: Client) {
        Config()
    }

    private readonly firstStatement = process.env.FIRST_STATEMENT || 'Your OTP Code is '
    private readonly lastStatement = process.env.LAST_STATEMENT || ' Keep Secret!'

    private readonly sendMessageSchema: SendMessageSchema = new SendMessageSchema()

    public sendMessage = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const data = req.body
        const { error } = this.sendMessageSchema.sendMessage.validate(data)
        if (error)
            return res.status(400).send({
                message: error.details[0].message
            })
        const { message } = data
        console.log(req.body)
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: `${message}`
        })
        return res.status(202).send({
            message: 'success sending message',
            info: {
                phoneNumber: phoneNumber,
                message: message
            }
        })
    }
}
