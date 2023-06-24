const User=require('../models/users');

exports.postSignup=async(req,res,next)=>{
    try{
        const result=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        res.json(result);
    }
    catch(err){
        console.log(err.message);
        res.status(409).json({'message':'email already exist'});
    }
}