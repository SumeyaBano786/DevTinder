const express=require('express');
const userRouter=express.Router();

const userAuth= require('../middlewares/userAuth');
const ConnectionRequest= require('../models/connectionRequestModel');

userRouter.get('/user/requests/received', userAuth, async(req ,res)=>{
    try{
        const loggedInUser= req.user;
//console.log(loggedInUser);
        const ConnectionRequests= await ConnectionRequest.find({
              toUserId: loggedInUser.id,
              status:"interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoURl", "age", "gender", "about", "skills"]);
      //  console.log(ConnectionRequests);

        res.json({
            message:"Data fetched successfully",
            data:ConnectionRequests,
        })

    }catch(error){
        res.status(400).send(error.message);
    }
})


userRouter.get('/user/connections',userAuth, async(req,res)=>{
    try{

        const loggedInUser=req.user;
        const connectionrequests= await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser.id , status:"accepted"},
                {fromUserId:loggedInUser.id, status:"accepted"}
            ]

        }).populate("fromUserId", ["firstName", "lastName", "photoURl", "age", "gender", "about", "skills"]).populate("toUserId", ["firstName", "lastName", "photoURl", "age", "gender", "about", "skills"]);

        const data= connectionrequests.map((row)=>{
            if(row.fromUserId.id.toString()=== loggedInUser.id.toString()){
                return row.toUserId
            }
            return row.fromUserId;
        });
        res.json({
            data
        })

    }catch(error){
        res.status(400).send(error.message);
    }
})

module.exports= userRouter;