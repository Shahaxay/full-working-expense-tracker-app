const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan')
const fs=require('fs');
const path=require('path');

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

app.use(bodyParser.json({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:logStremFile}));


app.use('/user',userRouter);

app.use('/password',passwordRouter);

// app.use(authentication.authenticate);

app.use('/expense',authentication.authenticate,expenseRouter);

app.use('/purchase',authentication.authenticate,purchaseRoute);

app.use('/premium',authentication.authenticate,premiumRoute);


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
})
.catch(err=>console.log(err));

