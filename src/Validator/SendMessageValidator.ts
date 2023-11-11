import Joi from 'joi'

export class SendMessageValidator {
    public sendMessage = Joi.object().required().keys({
        message: Joi.string()
    })
}
