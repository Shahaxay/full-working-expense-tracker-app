const User=require('../models/users');
const Expense=require('../models/expense');

exports.postAddExpense=async (req,res,next)=>{
    let {expenseAmount,description,category}=req.body;
    console.log(expenseAmount,description,category);
    try{
        const result=await req.user.createExpense({expenseAmount,description,category});
        res.status(200).json({id:result.id});
    }
    catch(err){
        console.log(err.message);
    }
}
exports.getExpenses=async (req,res,next)=>{
    try{
        // const expenses=await Expense.findAll({where:{userId:req.user.id}});
        const expenses=await req.user.getExpenses();
        res.status(200).json({expenses,isPremiumUser:req.user.ispremiumuser});
    }
    catch(err){
        console.log(err.message);
    }
} 

exports.deleteExpense=async(req,res,next)=>{
    try{
        const expenseId=req.params.expenseId;
        const expense=await req.user.getExpenses
        ({where:{id:expenseId}});
        // const expense=await Expense.findByPk(expenseId);
        await expense[0].destroy();
        res.status(200).json({success:true});
    }
    catch(err){
        console.log(err.message);
    }
}