import {
    CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
    Op
} from '@sequelize/core'
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'otp' })
export default class OneTimePasswordModel extends Model<
    InferAttributes<OneTimePasswordModel>,
    InferCreationAttributes<OneTimePasswordModel>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare otpCode: number

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare phoneNumber: number

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare attempt: number

    @Attribute(DataTypes.BOOLEAN)
    declare isUsed: boolean

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>

    private readonly otp = OneTimePasswordModel
    private readonly lifetime = parseInt(process.env.OTP_LIFETIME || '2')
    private readonly attempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '3')

    public getOTPFromPhoneNumber = async (phoneNumber: number): Promise<OneTimePasswordModel | null> => {
        return await this.otp.findOne({
            where: {
                [Op.and]: [
                    { phoneNumber },
                    { isUsed: false },
                    { attempt: { [Op.lt]: this.attempts } },
                    { createdAt: { [Op.gte]: new Date(Date.now() - 60000 * this.lifetime) } }
                ]
            }
        })
    }

    public createOTP = async (phoneNumber: number, otpCode: number): Promise<void> => {
        await this.otp.create({
            phoneNumber,
            otpCode,
            attempt: 0,
            isUsed: false
        })
    }

    public updateOTP = async (phoneNumber: number, attempt: number, isUsed: boolean): Promise<void> => {
        await this.otp.update(
            {
                attempt,
                isUsed
            },
            {
                where: {
                    [Op.and]: [
                        { phoneNumber },
                        { isUsed: false },
                        { attempt: { [Op.lte]: this.attempts } },
                        { createdAt: { [Op.gte]: new Date(Date.now() - 60000 * 2) } }
                    ]
                }
            }
        )
    }

    public deleteOTP = async (phoneNumber: number): Promise<void> => {
        await this.otp.destroy({
            where: {
                phoneNumber
            }
        })
    }
}
