const sequelize=require('sequelize');

const Expense=require('../models/expense');
const User = require('../models/users');

exports.getLeaderBoard=async(req,res,next)=>{
    try{
        const expenses=await Expense.findAll({
            attributes: ['userId',[sequelize.fn('sum', sequelize.col('expenseAmount')), 'totalExpenses']],
            group: ['userId'],
            order: [[sequelize.literal('totalExpenses'),'DESC']]
        });
        for(let expense of expenses){
            const obj=await User.findOne({where:{id:expense.userId}});
            expense.dataValues.name=obj.name;
        }
        // console.log(expenses);
        res.json(expenses);
    }
    catch(err){
        console.log(err);
    }
}
