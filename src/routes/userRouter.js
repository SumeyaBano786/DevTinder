const express=require('express');
const userRouter=express.Router();

const userAuth= require('../middlewares/userAuth');
const ConnectionRequest= require('../models/connectionRequestModel');
const User=require('../models/user');

userRouter.get('/user/requests/received', userAuth, async(req ,res)=>{
    try{
        const loggedInUser= req.user;
//console.log(loggedInUser);
        const ConnectionRequests= await ConnectionRequest.find({
              toUserId: loggedInUser.id,
              status:"interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);
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

        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]).populate("toUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);

        const data= connectionrequests.filter((row) => row.fromUserId && row.toUserId).map((row)=>{
           
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

userRouter.get('/feed', userAuth, async(req,res)=>{
    try{

        const loggedInUser= req.user;
        const page= parseInt(req.query.page) || 1;
        let limit= parseInt(req.query.limit) || 10;
        limit= limit> 50 ? 50: limit;

        const skip=(page - 1) * limit;
        const connectionrequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser.id},{toUserId:loggedInUser.id}
                 
            ]
            
        }).select("fromUserId toUserId");
        



        const hideUsersFromFeed = new Set();
        connectionrequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users= await User.find({
            $and:[
         { _id:{$nin: Array.from(hideUsersFromFeed)}},
         {_id:{$ne: loggedInUser.id}},
            ]
        }).select("firstName lastName photoUrl age gender about  skills").skip(skip).limit(limit);

        res.send(users);

    }catch(error){
        res.status(400).json({message:error.message});

    }
})

module.exports= userRouter;