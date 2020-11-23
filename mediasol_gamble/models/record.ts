import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, 
  BelongsToManyRemoveAssociationMixin, BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
  
class Record extends Model {
  public readonly id!: number;
  public startDate!: Date; //경기 시작일
  public endDate!: Date; //경기 종료일
  public winMember!: string;  //당첨자
  public is_active!: boolean; //경기 활성화 여부
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
  
Record.init({
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  winMember: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
    sequelize,
    modelName: 'Record',
    tableName: 'record',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
  
export const associate = (db: dbType) => {
  db.Record.belongsToMany(db.Member, { through: 'Attend' });
  db.Record.hasMany(db.Log, { as: 'Logs' });
};
  
export default Record;