const mongoose=require('mongoose')
const express=require('express');
const requestRouter=express.Router();
const ConnectionRequest=require('../models/connectionRequestModel');
const userAuth=require('../middlewares/userAuth');
const User=require('../models/user')
requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user.id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("invalid status type"+ status);
        }

           // ✅ Check ObjectId validity
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        
       const touser= await User.findById(toUserId);
        if(!touser){
            return res.status(404).send("user not found ");

          }

        //if there is an existing connection request

        const existingConnectionRequest=await ConnectionRequest.findOne(
            {
                $or:[
                    {fromUserId,toUserId},
                    {fromUserId:toUserId,toUserId:fromUserId}
                ]
            }
        )

        if(existingConnectionRequest){
            return res.send("this connection request is already exist");

        }

        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data=await connectionRequest.save();

        const user = await User.findById(fromUserId);
        const firstName = user.firstName;


         res.json({message:`${firstName}, sent the connection request`,data})

 }catch(error){
        res.json({
            message:error.message })
    }
})


module.exports=requestRouter;
