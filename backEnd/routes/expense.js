const express=require('express');

const expenseController=require('../controllers/expense');

const router=express.Router();


router.get('/getExpenses',expenseController.getExpenses);

router.post('/addExpense',expenseController.postAddExpense);

router.delete('/deleteExpense/:expenseId',expenseController.deleteExpense);

module.exports=router;