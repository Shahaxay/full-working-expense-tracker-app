const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const db=require('./util/database')
const userRouter=require('./routes/user');

const app=express();

app.use(bodyParser.json({extended:false}));
app.use(cors());

app.use(userRouter);

db.sync()
.then(result=>{
    app.listen(3000,()=>console.log("listening to port 3000..."))
})
.catch(err=>console.log(err));

