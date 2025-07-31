const express= require('express');
const http = require("http");
const app=express();
const cors=require('cors');
const connectDB=require('./config/database');
const User=require('./models/user');
const userAuth=require('./middlewares/userAuth')
const cookieParser = require('cookie-parser');

const initializeSocket=require('./utils/socket')
 const authRouter=require('./routes/authRouter');
 const profileRouter=require('./routes/profileRouter');
 const requestRouter=require('./routes/requestRouter');
 const userRouter= require('./routes/userRouter');
 const chatRouter=require('./routes/chatRouter')
 app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
 }));
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);
initializeSocket(server);



app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/', userRouter);
app.use('/',chatRouter);












connectDB().then(()=>{
    console.log("database is connected successfully");
    server.listen(3000,()=>{
    console.log("server is running on port 3000");
})
}).catch((err)=>{
    console.error("database could not connect");

})

