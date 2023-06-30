const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan')
const fs=require('fs');
const path=require('path');
const dotenv=require('dotenv');
dotenv.config();
// const https=require('https');

const db=require('./util/database')
const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRouter=require('./routes/password');
const Expence=require('./models/expense');
const User=require('./models/users');
const Order=require('./models/order');
const ForgetPasswordRequest=require('./models/forgetPasswordRequest');
const ExpenseReportLink=require('./models/expenseReportLink');
const authentication=require('./middleware/authentication');

const logStremFile=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

const app=express();

// const serverPrivateKey=fs.readFileSync('server.key');
// const sslCertificate=fs.readFileSync('server.cert');


app.use(bodyParser.json({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(helmet());
// app.use(helmet({
//     contentSecurityPolicy:{
//         directives:{
//             scriptSrc:["'self'",'cdnjs.cloudflare.com','checkout.razorpay.com','lumberjack-cx.razorpay.com']
//         }
//     }
// }));
app.use(morgan('combined',{stream:logStremFile}));

app.use('/user',userRouter);

app.use('/password',passwordRouter);

// app.use(authentication.authenticate);

app.use('/expense',authentication.authenticate,expenseRouter);

app.use('/purchase',authentication.authenticate,purchaseRoute);

app.use('/premium',authentication.authenticate,premiumRoute);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
});


User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPasswordRequest);
ForgetPasswordRequest.belongsTo(User);

User.hasMany(ExpenseReportLink);
ExpenseReportLink.belongsTo(User,);

// db.sync({force:true})
db.sync() 
.then(result=>{ 
    //PORT value inserted by hosting server
    app.listen(process.env.PORT||3000,()=>console.log("listening to port 3000..."))

    //checking with own signed ssl certificate with this web app// but we do not need to this as browser doesnot accept own signed ssl/tls certidicate
    //for the development environment we can use it but for the production we need to take SSL/TLS certificate from Certificate Authority which take kare of all the things
    // https.createServer({key:serverPrivateKey,cert:sslCertificate},app).listen(process.env.PORT||3000,()=>console.log("listening to port 3000..."))
   
})
.catch(err=>console.log(err));

