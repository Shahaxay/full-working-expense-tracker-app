const Sib = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const bcrypt=require('bcrypt');

const User = require('../models/users');
const ForgetPasswordRequest=require('../models/forgetPasswordRequest');

dotenv.config();


exports.postResetPassword = async (req, res, next) => {
    const requestId = uuidv4();
    const passwordResetApiLink = 'http://localhost:3000/password/resetpassword/' + requestId;
    const resetEmail = req.body.resetEmail;
    try {

        //find user
        const user = await User.findOne({ where: { email: resetEmail } });
        if (user) {
            user.createForgetPasswordRequest({ id: requestId, isactive: true });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.BREVO_API_KEY;

            const transEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: 'shahaxay34@gmail.com',
                name: 'Akshay'
            }

            const receiver = [
                {
                    email: req.body.resetEmail
                }
            ];

            const messageId=await transEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: "Reset password",
                textContent: `this is the email send to reset your {{params.website}} password`,
                params: {
                    website: 'Expense Tracker App'
                },
                htmlContent: `<h3>use the following link to reset your Expense Tracker App password</h3><a href="${passwordResetApiLink}">${passwordResetApiLink}</a>`
            })
            res.status(200).json({forgetPasswordRequestId:requestId});
        }
        else {
            res.status(400).json({ message: "user does not exist" });
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

exports.getResetPsswordHandler = async (req, res, next) => {
    const requestId = req.params.requestId;
    try{
        const resetRequest=await ForgetPasswordRequest.findOne({where:{id:requestId,isactive:true}});
        if(resetRequest){
            console.log("active..............");
            res.send(`<h3>Resetting password</h3><form action="http://localhost:3000/password/change-password/${requestId}" method="post"><label for="newpass">new password</label><input type="password" id="newpass" name="newpass"><button type="submit">change password</button></form>`);
            
            // res.status(200).json({forgetPasswordRequestId:rese});
            //send form
            // res.json({});
        }
        else{
            res.status(400).json({message:"the link has been expired"});
        }
        // console.log(requestId);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.postChangePassword=async (req,res,next)=>{
    const requestId=req.params.requestId;
    const newPassword=req.body.newpass;
    const request=await ForgetPasswordRequest.findOne({where:{id:requestId}});
    let salt=10;
    bcrypt.hash(newPassword,salt,async (err,hash)=>{
        if(err){
            console.log(err);
        }else{
            try{
                const promise1=User.update({password:hash},{where:{id:request.userId}});
                const promise2=ForgetPasswordRequest.update({isactive:false},{where:{id:requestId}})
                await Promise.all([promise1,promise2]);
                res.json({});
            }
            catch(err){
                console.log(err);
            }
        }
    })

    console.log(req.body);
    console.log(requestId);

    //encrypt password 
    //update password
    //update forgotpasswordtable 
} 