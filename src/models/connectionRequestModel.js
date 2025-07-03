const mongoose=require('mongoose');

const connectionRequestSchema= new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,


    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        },

    },

},{timestamps:true});

connectionRequestSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);


connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //check if the fromuserid is same as touserid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
    }
     next();
})

const connectionRequestModel= new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports=connectionRequestModel;