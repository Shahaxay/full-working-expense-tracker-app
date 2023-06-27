const express=require('express');

const passwordController=require('../controllers/password');

const router=express.Router();

//for sending reset link to the mail
router.post('/reset-password',passwordController.postResetPassword);

//for sending form
router.get('/resetpassword/:requestId',passwordController.getResetPsswordHandler)

//for changing the password and updating the forgetPasswordRequest table
router.post('/change-password/:requestId',passwordController.postChangePassword);


module.exports=router; 