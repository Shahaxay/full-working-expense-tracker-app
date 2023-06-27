const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    numberOfExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    }
});

module.exports=User;