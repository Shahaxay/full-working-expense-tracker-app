const express=require('express');

const userController=require('../controllers/user');

const router=express.Router();


router.post('/user/signup',userController.postSignup);

router.post('/user/login',userController.postLogin);

module.exports=router;