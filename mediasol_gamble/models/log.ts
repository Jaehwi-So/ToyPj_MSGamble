import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, 
  BelongsToManyRemoveAssociationMixin, BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
  
class Log extends Model {
  public readonly id!: number;
  public main_log!: string; //주요 메세지
  public sub_log!: string;  //부가 메세지
  public is_active!: boolean; //활성화 여부
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
  
Log.init({
  main_log: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  sub_log: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
    sequelize,
    modelName: 'Log',
    tableName: 'log',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
  
export const associate = (db: dbType) => {
  db.Log.belongsTo(db.Record);
};
  
export default Log;