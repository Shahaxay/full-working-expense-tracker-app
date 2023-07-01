const express=require('express');

const premiumController=require('../controllers/premium');

const router=express.Router();


router.get('/showLeaderBoard',premiumController.getLeaderBoard);

module.exports=router;