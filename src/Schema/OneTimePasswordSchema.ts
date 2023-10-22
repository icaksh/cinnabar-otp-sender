import Joi from 'joi'

export default class OneTimePasswordSchema {
    public reqOTP = Joi.object()
        .required()
        .keys({
            phoneNumber: Joi.number().min(999999).max(99999999999999)
        })

    public useOTP = Joi.object()
        .required()
        .keys({
            otpCode: Joi.number().required().min(100000).max(999999)
        })
}
