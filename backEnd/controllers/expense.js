const sequelize=require('../util/database');

exports.postAddExpense=async (req,res,next)=>{
    const transaction1=await sequelize.transaction();
    let {expenseAmount,description,category}=req.body;
    console.log(expenseAmount,description,category);
    try{
        const result=await req.user.createExpense({expenseAmount,description,category},{transaction:transaction1});
        // console.log(req.user.totalExpenses);
        let totalExpense=req.user.totalExpenses+parseInt(expenseAmount);
        await req.user.update({totalExpenses:totalExpense},{transaction:transaction1});
        await transaction1.commit();
        res.status(200).json({id:result.id});
    }
    catch(err){
        await transaction1.rollback();
        console.log(err.message);
        res.status(400).json(err);
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
    const transaction1=await sequelize.transaction();
    try{
        const expenseId=req.params.expenseId;
        const expense=await req.user.getExpenses
        ({where:{id:expenseId},transaction:transaction1});
        //updating totalExpense
        let totalExpense=req.user.totalExpenses-parseInt(expense[0].expenseAmount);
        await req.user.update({totalExpenses:totalExpense},{transaction:transaction1});
        // const expense=await Expense.findByPk(expenseId);
        await expense[0].destroy({transaction:transaction1});
        await transaction1.commit();
        res.status(200).json({success:true});
    }
    catch(err){
        await transaction1.rollback();
        console.log(err.message);
        res.status(400).json(err); 
    } 
} 