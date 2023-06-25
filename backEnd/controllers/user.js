const bcrypt=require('bcrypt');
const jsonwebtoken=require('jsonwebtoken');

const User=require('../models/users');

exports.postSignup=async(req,res,next)=>{
    let {name,email,password}=req.body;
    let salt=10;
    bcrypt.hash(password,10,async (err,hash)=>{
        if(err){
            console.log(err);
        }else{
            try{
                const result=await User.create({
                    name,
                    email,
                    password:hash
                });
                res.status(200).json(result);
            }
            catch(err){
                console.log(err.message);
                res.status(409).json({'message':'email already exist'});
            }
        }
    })
}

exports.postLogin=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const result=await User.findAll({where:{email:email}});
        if(result.length==0){
            res.status(404).json({success:"false",message:"User not found"});
        }else{
            bcrypt.compare(password,result[0].password,(err,results)=>{
            if(err){ 
                throw new Error("Something went wrong");
            }
            else if(results){
                res.status(200).json({success:"true",message:"logged in successfully",token:generateToken(result[0].id,result[0].name)});
            }else{
                res.status(401).json({success:"false",message:'User not authorized'});
            }
        })
    }
    }
    catch(err){
        console.log(err);
    }
}

//generating token to know users
function generateToken(id,userName){
    const token=jsonwebtoken.sign({userId:id,userName:userName},'this_is_my_secret_key');
    return token;
}