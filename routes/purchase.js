const express=require('express');

const purchaseController=require('../controllers/purchase');

const router=express.Router();

router.get('/purchase-premium',purchaseController.getPurchasePremium);

router.post('/update-premium',purchaseController.postUpdatePremium);

module.exports=router;