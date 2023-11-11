import Joi from 'joi'

export const reqOTP = Joi.object()
    .required()
    .keys({
        phoneNumber: Joi.number().min(999999).max(99999999999999).required()
    })

export const getOTP = Joi.object()
    .required()
    .keys({
        phoneNumber: Joi.number().min(999999).max(99999999999999).required()
    })

export const useOTP = Joi.object()
    .required()
    .keys({
        phoneNumber: Joi.number().min(999999).max(99999999999999).required(),
        otpCode: Joi.number().required().min(100000).max(999999).required()
    })
