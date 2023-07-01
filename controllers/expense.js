const sequelize=require('../util/database');


exports.postAddExpense=async (req,res,next)=>{
    const transaction1=await sequelize.transaction();
    let {expenseAmount,description,category}=req.body;
    console.log(expenseAmount,description,category);
    try{
        const result=await req.user.createExpense({expenseAmount,description,category},{transaction:transaction1});
        // console.log(req.user.totalExpenses);
        let totalExpense=req.user.totalExpenses+parseInt(expenseAmount);
        let numberOfExpenses=req.user.numberOfExpenses+1;
        await req.user.update({totalExpenses:totalExpense,numberOfExpenses:numberOfExpenses},{transaction:transaction1});
        await transaction1.commit();
        res.status(200).json({id:result.id,premium:req.user.ispremiumuser,numberOfExpense:req.user.numberOfExpenses});
    }
    catch(err){
        await transaction1.rollback();
        console.log(err.message);
        res.status(400).json(err);
    }
}
exports.getExpenses=async (req,res,next)=>{
    const page=Number(req.query.page);
    const rows_per_page=Number(req.query.rows_per_page);
    const TOTAL_NUMBER_OF_EXPENSES=req.user.numberOfExpenses;
    let ITEMS_PER_PAGE=10;
    if(rows_per_page){
        ITEMS_PER_PAGE=rows_per_page;
    }
    try{
        // const expenses=await Expense.findAll({where:{userId:req.user.id}});
        const expenses=await req.user.getExpenses({
            limit:ITEMS_PER_PAGE,
            offset:(Number(page)-1)*ITEMS_PER_PAGE
        });
        const resObj={
            expenses,
            currentPage:page,
            hasPrevious:page>1,
            hasNext:(page*ITEMS_PER_PAGE)<TOTAL_NUMBER_OF_EXPENSES,
            previousPage:page-1, 
            nextPage:page+1
        }
        res.status(200).json(resObj);
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
        let numberOfExpenses=req.user.numberOfExpenses-Number(expense[0].numberOfExpenses);
        await req.user.update({totalExpenses:totalExpense,numberOfExpenses:numberOfExpenses},{transaction:transaction1});
        // const expense=await Expense.findByPk(expenseId);
        await expense[0].destroy({transaction:transaction1});
        await transaction1.commit();
        res.status(200).json({success:true,ispremiumuser:req.user.ispremiumuser});
    }
    catch(err){
        await transaction1.rollback();
        console.log(err.message);
        res.status(400).json(err); 
    } 
} 