const razorpay=require('razorpay');

const Order=require('../models/order');

const dotenv=require('dotenv');
const { or } = require('sequelize');
dotenv.config();


exports.getPurchasePremium=async(req,res,next)=>{
    //creating object of rezorpay
    let rez=new razorpay({
        key_id : process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_KEY_SECRET
    })

    let amount=5000;
    // creating order on rezorpay
    rez.orders.create({amount:amount,currency:'INR'},async (err,order)=>{
        if(err){
            console.log(err);
        }else{
            // res.json(order);
            try{
                await req.user.createOrder({order_id:order.id,order_status:"pending"});
                res.json({key_id:process.env.RAZORPAY_KEY_ID,order_id:order.id});
            }
            catch(err){
                console.log(err.message);
            }
        }
    })
}
exports.postUpdatePremium=async(req,res,next)=>{
    let {order_id,payment_id}=req.body;
    const order=await req.user.getOrders({where:{order_id:order_id}});
    order[0].payment_id=payment_id;
    order[0].order_status="success";
    order[0].save();

    //update the ispremiumuser column of user
    req.user.ispremiumuser=true;
    req.user.save();
    res.json({"status":"success"});
}