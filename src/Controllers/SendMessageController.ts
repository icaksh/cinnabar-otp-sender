import { config as Config } from 'dotenv'
import { type Request, type Response } from 'express'
import { type Client } from '../Structures'

export default class SendMessageController {
    constructor(private readonly client: Client) {
        Config()
    }

    private readonly firstStatement = process.env.FIRST_STATEMENT || 'Your OTP Code is '
    private readonly lastStatement = process.env.LAST_STATEMENT || ' Keep Secret!'

    public sendMessage = async (req: Request, res: Response) => {
        const { phoneNumber } = req.params
        const data = req.body
        const { message } = data
        await this.client.sendMessage(phoneNumber + '@c.us', {
            text: `${message}`
        })
        return res.status(202).send({
            message: 'success sending message',
            info: {
                phoneNumber,
                message
            }
        })
    }
}
