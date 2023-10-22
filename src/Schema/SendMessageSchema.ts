import Joi from 'joi'

export default class SendMessageSchema {
    public sendMessage = Joi.object()
        .required()
        .keys({
            message: Joi.string()
        })
}
