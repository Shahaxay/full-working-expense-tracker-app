const jsonwebtoken=require('jsonwebtoken');
const User=require('../models/users');
exports.authenticate=async (req,res,next)=>{
    const token=req.headers.token;
    const decrypt=jsonwebtoken.verify(token,"this_is_my_secret_key");
    try{
        const user=await User.findByPk(decrypt.userId);
        req.user=user;
    }
    catch(err){
        console.log(err.message);
        console.log("not a valid user");
    }
    next();
}