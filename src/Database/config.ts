import { Sequelize } from '@sequelize/core'
import SessionModel from './Models/SessionModel'
import OneTimePasswordModel from './Models/OneTimePasswordModel'
import { dirname } from 'path'

// const dbName = process.env.DB_NAME as string
// const dbUser = process.env.DB_USER as string
// const dbHost = process.env.DB_HOST
// const dbDriver = process.env.DB_DRIVER
// const dbPassword = process.env.DB_PASSWORD as string

const connectDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/../../otp.db',
    models: [SessionModel, OneTimePasswordModel]
})

export default connectDatabase
