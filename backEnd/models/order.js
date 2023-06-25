const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Order=sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    order_id:{
        type:Sequelize.STRING,
        allowNull:false
    },
    payment_id:Sequelize.STRING,
    order_status:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=Order;