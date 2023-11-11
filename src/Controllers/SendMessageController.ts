import { config as Config } from 'dotenv'
import { type Request, type Response } from 'express'
import { type Client } from '../Structures'

export class SendMessageController {
    constructor(private readonly client: Client) {
        Config()
    }

    public sendMessage = async (req: Request, res: Response) => {
        const data = req.body
        const { phoneNumber, message } = data
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
