const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const db=require('./util/database')
const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const Expence=require('./models/expense');
const User=require('./models/users');
const authentication=require('./middleware/authentication');


const app=express();

app.use(bodyParser.json({extended:false}));
app.use(cors());

app.use('/user',userRouter);

app.use(authentication.authenticate);

app.use('/expense',expenseRouter);

User.hasMany(Expence);
Expence.belongsTo(User);

// db.sync({force:true})
db.sync()
.then(result=>{ 
    app.listen(3000,()=>console.log("listening to port 3000..."))
})
.catch(err=>console.log(err));

