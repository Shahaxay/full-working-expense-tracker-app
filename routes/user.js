const express=require('express');

const userController=require('../controllers/user');
const authentication=require('../middleware/authentication');

const router=express.Router();


router.post('/signup',userController.postSignup);

router.post('/login',userController.postLogin);

router.get('/download-report',authentication.authenticate,userController.getDownloadReport);

router.get('/getExpenseReports',authentication.authenticate,userController.getExpenseReports);

module.exports=router;