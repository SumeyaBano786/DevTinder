const express= require('express');
const app=express();
const cors=require('cors');
const connectDB=require('./config/database');
const User=require('./models/user');
const userAuth=require('./middlewares/userAuth')
const cookieParser = require('cookie-parser');
 const authRouter=require('./routes/authRouter');
 const profileRouter=require('./routes/profileRouter');
 const requestRouter=require('./routes/requestRouter');
 const userRouter= require('./routes/userRouter');
 app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/', userRouter);












connectDB().then(()=>{
    console.log("database is connected successfully");
    app.listen(3000,()=>{
    console.log("server is running on port 3000");
})
}).catch((err)=>{
    console.error("database could not connect");

})

