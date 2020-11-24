import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, 
  BelongsToManyRemoveAssociationMixin, BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
  
class Member extends Model {
  //! : null과 undefined 허용 ? : 필수값이 아닌 optional한 값
  public readonly id!: number;
  public m_id!: string;   //아이디
  public m_pwd!: string;  //비밀번호
  public m_name!: string; //이름
  public point!: number;  //현재 포인트
  public is_join!: boolean;  //현재경기 참여여부
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
  
Member.init({
  m_id: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  m_pwd: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  m_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_join: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
    sequelize,
    modelName: 'Member',
    tableName: 'members',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
  
export const associate = (db: dbType) => {
  db.Member.belongsToMany(db.Record, { through: 'Attend' });
};
  
export default Member;