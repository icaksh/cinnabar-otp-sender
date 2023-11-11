import { DataTypes, type InferAttributes, type InferCreationAttributes, Model } from '@sequelize/core'
import { Attribute, PrimaryKey, Table } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'session' })
export class SessionModel extends Model<InferAttributes<SessionModel>, InferCreationAttributes<SessionModel>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    declare id: string

    @Attribute(DataTypes.STRING)
    declare session: string | undefined

    private readonly sessionModel = SessionModel

    public getSession = async (sessionId: string): Promise<SessionModel | null> =>
        await this.sessionModel.findOne({
            where: {
                id: sessionId
            }
        })

    public saveNewSession = async (sessionId: string): Promise<void> => {
        await this.sessionModel.create({
            id: sessionId
        })
    }

    public updateSession = async (sessionId: string, session: string): Promise<void> => {
        const clientSession = await this.getSession(sessionId)
        if (clientSession) {
            clientSession.session = session
            await clientSession.save()
        }
    }

    public removeSession = async (sessionId: string): Promise<void> => {
        await this.sessionModel.destroy({
            where: {
                id: sessionId
            }
        })
    }
}
