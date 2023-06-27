const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

const User = require('../models/users');

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
                const fileURL=await uploadToS3(data,filename);
                res.status(200).json({success:true,fileURL:fileURL});
            }
            catch(err){
                res.status(200).json({success:true,fileURL:result.Location});
            }
        } else {
            res.status(400).json({ message: 'get premium to download reports', success: 'false' });
        }
    }
    catch (err) {
        console.log(err);
    }
}

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expense-tracking-app-akshay';

            const bucketS3 = new AWS.S3({
                accessKeyId: process.env.IAM_USER_ACCESS_KEY,
                secretAccessKey: process.env.IAM_USER_SECRET_ACCESS_KEY
            });

            const params = {
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: data,
                ACL: 'public-read'
            };
            console.log(data);
            return new Promise((resolve,reject)=>{
                bucketS3.upload(params, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result.Location);
                }
            })
        });
}

module.exports = {
    postSignup,
    postLogin,
    getDownloadReport
};