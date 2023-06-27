const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/users');
const UserService=require('../services/userService');
const AwsS3Service=require('../services/awsS3Service');

dotenv.config();

const postSignup = async (req, res, next) => {
    let { name, email, password } = req.body;
    let salt = 10;
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log(err);
        } else {
            try {
                const result = await User.create({
                    name,
                    email,
                    password: hash
                });
                res.status(200).json(result);
            }
            catch (err) {
                console.log(err.message);
                res.status(409).json({ 'message': 'email already exist' });
            }
        }
    })
}

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await User.findAll({ where: { email: email } });
        if (result.length == 0) {
            res.status(404).json({ success: "false", message: "User not found" });
        } else {
            bcrypt.compare(password, result[0].password, (err, results) => {
                if (err) {
                    throw new Error("Something went wrong");
                }
                else if (results) {
                    res.status(200).json({ success: "true", message: "logged in successfully", token: generateToken(result[0].id, result[0].name) });
                } else {
                    res.status(401).json({ success: "false", message: 'User not authorized' });
                }
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}

//generating token to know users
function generateToken(id, userName) {
    const token = jsonwebtoken.sign({ userId: id, userName: userName }, 'this_is_my_secret_key');
    return token;
}

const getDownloadReport = async (req, res, next) => {
    try {

        if (req.user.ispremiumuser) {
            //send request to the AWS S3, upload and get link
            try{
                const filename = `Expense/${req.user.id}${new Date()}.txt`;
                const expenses = await req.user.getExpenses();
                const data = JSON.stringify(expenses);
                const fileURL=await AwsS3Service.uploadToS3(data,filename);
                //updating expenseReportLink model
                await req.user.createExpenseReportLink({reports:fileURL});
                res.status(200).json({success:true,fileURL:fileURL});
            }
            catch(err){
                console.log(err);
                res.status(400).json({message:'something went wrong',success:false,fileURL:''});
            }
        } else {
            res.status(400).json({ message: 'get premium to download reports', success: 'false' });
        }
    }
    catch (err) {
        console.log(err);
    }
}


const getExpenseReports=async (req,res,next)=>{
    try{
        const reports=await UserService.getExpenseReportLinks(req);
        // console.log(reports);
        res.status(200).json({reports});
    }
    catch(err){
        console.log(err);
        res.status(500).json({sataus:false,message:'cannot get expense reports'})
    }
}

module.exports = {
    postSignup,
    postLogin,
    getDownloadReport,
    getExpenseReports
};