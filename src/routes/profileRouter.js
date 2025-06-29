const express=require('express')
const profileRouter=express.Router();
const User=require('../models/user');
const userAuth=require('../middlewares/userAuth');



profileRouter.get('/profile/view', userAuth,async(req,res)=>{
   
    try{
      
      const user=  await User.findOne({emailId:req.user.emailId});

      if(user.length===0){
       return  res.status(404).send("user not found with this mail");
      }
      res.send(user);

    }catch(error){
        res.send(error.message);

    }
})



module.exports=profileRouter;