import { 
    Model, DataTypes, BelongsToManyGetAssociationsMixin, 
    HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
    BelongsToManyAddAssociationMixin,
   } from 'sequelize';
  import { dbType } from './index';
  import { sequelize } from './sequelize';
  
  class Member extends Model {
    public readonly id!: number;
    public nickname!: string;
    public userId!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  
  }
  
  Member.init({
    nickname: {
      type: DataTypes.STRING(20),
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  
  export const associate = (db: dbType) => {
    db.User.hasMany(db.Post, { as: 'Posts' });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
  };
  
  export default User;