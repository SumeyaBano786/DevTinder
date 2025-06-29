const express=require('express')
const authRouter=express.Router();
const validator=require('validator')
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const secretKey="#1240";
const userAuth=require('../middlewares/userAuth')
const {validatesignup,validateupdate}=require('../utils/validation');



authRouter.post('/signup',async(req ,res)=>{
  
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



authRouter.post('/login',async(req,res)=>{
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


authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
   // res.send();
    return res.send("logout successfully");
})

authRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
      if(! validateupdate(req)){
        return  res.send("invalid fields update request");
      }

      //const loggedinUser=req.user;
      const loggedinUser = await User.findById(req.user.id);


      Object.keys(req.body).forEach((key)=>(loggedinUser[key]=req.body[key]));
     await loggedinUser.save();

      return  res.send(`${loggedinUser.firstName} your profile updated succesfully`);


    }catch(error){
        res.send(error.message)
    }


})

authRouter.patch('/profile/forgot-password',userAuth,async(req,res)=>{
    try{
        const{emailId,newPassword}=req.body;
        const user= await User.findOne({emailId});
         if (!user) {
            return res.status(404).send("User with this email does not exist");
        }

        if(!validator.isStrongPassword(newPassword)){
            return res.send("please provide an strong assword")
        }
       const hasshedpassword=await bcrypt.hash(newPassword,10);
       user.password=hasshedpassword;
       await user.save();
       return res.send("password updated successfully");


    }catch(error){
      return  res.send(error.message);
    }
})



module.exports=authRouter;
