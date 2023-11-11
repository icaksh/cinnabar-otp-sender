import { CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from '@sequelize/core'
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'otp' })
export class OneTimePasswordModel extends Model<
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

    @Attribute(DataTypes.DATE)
    declare updatedAt: CreationOptional<Date>
}
