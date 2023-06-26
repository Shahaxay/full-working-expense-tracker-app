const express=require('express');

const passwordController=require('../controllers/password');

const router=express.Router();

router.post('/reset-password',passwordController.postResetPassword);

module.exports=router; 