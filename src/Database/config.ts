import * as dotenv from 'dotenv';
dotenv.config();

import { Dialect, Sequelize } from '@sequelize/core'
import {SessionModel, OneTimePasswordModel} from './Models';

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
    dialectOptions:{
        ssl:{
            rejectUnauthorized: false
        }
        
    }

})

export default connectDatabase
