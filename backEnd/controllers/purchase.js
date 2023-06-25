const razorpay=require('razorpay');

const Order=require('../models/order');
const User=require('../models/users');

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
exports.postUpdatePremium=(req,res,next)=>{
    let {order_id,payment_id}=req.body;
    Order.findOne({where:{order_id:order_id}})
    .then(order=>{
        const promise1=order.update({payment_id:payment_id,order_status:"success"});
        const promise2=req.user.update({ispremiumuser:1});
        Promise.all([promise1,promise2])
        .then(result=>{
            console.log(result);
            res.json({"status":"success"});
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
}

// exports.postUpdatePremium=async(req,res,next)=>{
//     let {order_id,payment_id}=req.body;
//     const order=await req.user.getOrders({where:{order_id:order_id}});
//     order[0].payment_id=payment_id;
//     order[0].order_status="success";
//     order[0].save();

//     //update the ispremiumuser column of user
//     req.user.ispremiumuser=true;
//     req.user.save();
//     res.json({"status":"success"});
// }

// exports.postUpdatePremium=async(req,res,next)=>{
//     let {order_id,payment_id}=req.body;
//     try{
//         const order=await req.user.getOrders({where:{order_id:order_id}});
//         await order[0].update({payment_id:payment_id,order_status:"success"});
    
//         //update the ispremiumuser column of user
//         await req.user.update({ispremiumuser:'true'});
//         res.json({"status":"success"});
//     }
//     catch(err){console.log(err.message)};
// }


