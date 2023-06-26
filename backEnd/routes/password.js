const express=require('express');

const passwordController=require('../controllers/password');

const router=express.Router();

router.use('/resetpassword/:requestId',passwordController.getResetPsswordHandler)

router.post('/reset-password',passwordController.postResetPassword);

router.post('/change-password/:requestId',passwordController.postChangePassword);


module.exports=router; 