import * as dotenv from 'dotenv'

import { type Dialect, Sequelize, sql } from '@sequelize/core'
import { SessionModel, OneTimePasswordModel } from './Models'
import { P, pino } from 'pino'
dotenv.config()

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST as string
const dbDriver = process.env.DB_DRIVER as Dialect
const dbPassword = process.env.DB_PASSWORD as string
const connectDatabase = new Sequelize({
    host: dbHost,
    dialect: dbDriver,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    models: [SessionModel, OneTimePasswordModel],
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    logging: pino({level: "fatal"}).info(sql) as any
})

export default connectDatabase
