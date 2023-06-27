const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const ExpenseReportLink=sequelize.define('expenseReportLink',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    reports:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=ExpenseReportLink;