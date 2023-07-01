const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const ForgetPasswordRequest=sequelize.define('forgetPasswordRequest',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
    },
    isactive:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=ForgetPasswordRequest;