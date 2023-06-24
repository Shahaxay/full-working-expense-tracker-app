const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('expense-complete','root','sweetualsubaby',{dialect:'mysql',host:'localhost'});

module.exports=sequelize;