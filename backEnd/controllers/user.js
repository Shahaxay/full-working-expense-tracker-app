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

exports.postLogin=async(req,res,next)=>{
    try{
        const result=await User.findAll({where:{email:req.body.email}});
        if(result.length==0){
            res.status(404).json({success:"0",message:"user does not exists"});
        }else if(result[0].password!==req.body.password){
            res.json({success:"false",message:'password wrong'});
        }else{
            res.json({success:"true",message:"logged in"});
        }
    }
    catch(err){
        console.log(err);
    }
}