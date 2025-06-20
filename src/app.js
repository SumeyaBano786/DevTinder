const express= require('express');
const app=express();
const connectDB=require('./config/database');
const User=require('./models/user');
const {validatesignup}=require('./utils/validation');
const bcrypt=require('bcrypt');
app.use(express.json());




app.post('/signup',async(req ,res)=>{
    {/*const user=new User({
        firstName:"buggu",
        lastName:"summa",
        emailId:"buggu@gmail.com",
    
    });*/}
    //console.log(req.body);
    
    try{
        validatesignup(req);
        const {firstName,lastName,emailId,password,age,gender,skills}=req.body;
        const hasshedpassword= await bcrypt.hash(password,10);
        console.log(hasshedpassword);
        const user= new User({firstName,lastName,emailId,age,gender,skills,password:hasshedpassword});
        await user.save();
    res.send("user added successfully");
    }
    catch(error){
        res.send(error.message);
    }

    
})

//get user by email
app.get('/user',async(req,res)=>{
    const useremail=req.body.emailId;
    try{
      const user=  await User.findOne({emailId:useremail});

      if(user.length===0){
        res.status(404).send("user not found with this mail");
      }
      res.send(user);

    }catch(error){
        res.send(error.message);

    }
})

//get all the user info

app.get('/alluser', async(req,res)=>{
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

