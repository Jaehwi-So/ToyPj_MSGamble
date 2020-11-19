const Sequelize = require('sequelize');
module.exports = class Member extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            m_id : {    
                type : Sequelize.STRING(50),
                allowNull : false,
                unique : true
            },
            m_pwd : {
                type : Sequelize.STRING(50),
                allowNull : false,
                unique : false
            },
            m_name : {    
                type : Sequelize.STRING(30),
                allowNull : false,
                unique : false
            },
        },{
            sequelize,  
            timestamps : false, 
            modelName : 'Member',
            tableName : 'members',
            paranoid : false, 
            charset : 'utf8',
            collate : 'utf8_general_ci'
        });
    }
    static associate(db){
    }
}