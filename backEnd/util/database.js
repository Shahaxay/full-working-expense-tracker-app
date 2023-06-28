const {Sequelize}=require('sequelize');
const dotenv=require('dotenv');
dotenv.config();

const sequelize=new Sequelize(process.env.DATABASE,process.env.SQL_USERNAME,process.env.SQL_PASSWORD,{dialect:'mysql',host:'localhost'});

module.exports=sequelize;