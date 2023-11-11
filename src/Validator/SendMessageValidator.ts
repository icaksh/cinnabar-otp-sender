import Joi from 'joi'

export const sendMessage = Joi.object().required().keys({
    phoneNumber: Joi.number().min(999999).max(99999999999999).required(),
    message: Joi.string().required()
})