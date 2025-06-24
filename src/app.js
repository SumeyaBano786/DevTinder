const express= require('express');
const app=express();
const connectDB=require('./config/database');
const User=require('./models/user');
const {validatesignup}=require('./utils/validation');
//const validation=require('./utils/validation')
const userAuth=require('./middlewares/userAuth')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
//const cookieparser=require('cookie-parser');
const cookieParser = require('cookie-parser');
 const secretKey="#1240"
app.use(express.json());
app.use(cookieParser());




app.post('/signup',async(req ,res)=>{
  
    try{
       validatesignup(req);
        const {firstName,lastName,emailId,password,age,gender,skills}=req.body;
        const hasshedpassword= await bcrypt.hash(password,10);
       // console.log(hasshedpassword);
        const user= new User({firstName,lastName,emailId,age,gender,skills,password:hasshedpassword});
        await user.save();
    res.send("user added successfully");
    }
    catch(error){
        res.send(error.message);
    }

    
})

app.post('/login',async(req,res)=>{
    try{
        const{firstName,emailId,password}=req.body;
        const user= await User.findOne({emailId,firstName});
        if(!user){
           return  res.status(400).send("Invalid credentials");
        }
        const ismatch= await bcrypt.compare(password, user.password);
        if(!ismatch){
           return  res.status(400).send("Invalid credentials");
        }
        //yahan pe 1 token bhej do cookies k through
        //const secretKey="#1240"
        const token=jwt.sign({id:user._id,emailId:user.emailId},
            secretKey,{expiresIn:"1d"}

        )
        res.cookie("token", token,{expires:new Date(Date.now()+7*24*60*60*1000)});
        
      return res.send("login successfull")


    }catch(error){
       return res.send({message:error.message})

    }
})

//get user by email
app.get('/profile', userAuth,async(req,res)=>{
    //yahan is route pe aate hi pehle hi check karna hoga ki token valid hai ya nhi , are fir wo jo token kis user ka hai
    //check karke usku uska data dena hoga
    
    try{
      {/*}  const token=req.cookies.token;
        if(!token){
            return res.send("token is missing, please login again");
        }
        const decoded=jwt.verify(token,secretKey);
       // const useremail=req.body.emailId;*/}
      const user=  await User.findOne({emailId:req.user.emailId});

      if(user.length===0){
       return  res.status(404).send("user not found with this mail");
      }
      res.send(user);

    }catch(error){
        res.send(error.message);

    }
})

//get all the user info

app.get('/alluser',userAuth, async(req,res)=>{
    const alluser=await User.find({});
    try{
        res.send(alluser);
    }catch(error){
        res.send(error.message);
    }
})


app.delete('/user',async(req,res)=>{
    const userid=req.body.userId;
    try{
        //await User.findByIdAndDelete({_id:userid});

        await User.findByIdAndDelete(userid);
        res.send("user deleted successfully")

    }catch(error){
        res.send(error.message);

    }
})

//upadte user info

app.patch('/user/:userid',async(req,res)=>{
    const userid= req.params?.userid;
    const data=req.body;
    
    try{
        const ALLOWED_UPDATES=["userId","photoUrl","about","gender","age","skills","firstName","password"];

    const isupdateallowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    if(!isupdateallowed){
        return  res.send("some of them are not allowed to be udated");
    }
    if(data?.skills.length>10){
        throw new Error("skills can not be more than 10");
    }
           const updateduser=  await User.findByIdAndUpdate(userid,data);
           console.log(updateduser);
        res.send("user updated successfully");

    }catch(error){
        res.send(error.message);
    }
})





connectDB().then(()=>{
    console.log("database is connected successfully");
    app.listen(3000,()=>{
    console.log("server is running on port 3000");
})
}).catch((err)=>{
    console.error("database could not connect");

})

