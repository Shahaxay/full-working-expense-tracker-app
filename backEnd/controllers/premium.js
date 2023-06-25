const sequelize=require('sequelize');

const Expense=require('../models/expense');
const User = require('../models/users');

exports.getLeaderBoard=async(req,res,next)=>{
    try{
        const newJoinedExpenses=await User.findAll({
            attributes:['id','name',[sequelize.fn('sum', sequelize.col('expenseAmount')), 'totalExpenses']],
            include:{
                model:Expense,
                attributes:[]
            },
            group:['users.id'],
            order:[[sequelize.literal('totalExpenses'),'DESC']]
        })
        res.json(newJoinedExpenses);
    }
    catch(err){
        console.log(err);
    }
}
