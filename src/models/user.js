const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:15

    },
    lastName:{
         type:String

    },
    emailId:{
         type:String,
         lowercase:true,
         required:true,
         unique:true,
         trim:true,
         validate(value){
          if(!validator.isEmail(value)){
               throw new Error("not a valid email");
          }
         }

    },
    password:{
         type:String,
         required:true,
          validate(value){
          if(!validator.isStrongPassword(value)){
               throw new Error("Enter a strong password");
          }
         }

    },
    age:{
         type:Number,
         min:18

    },
    gender:{
         type:String,
         validate(value){
          if(!["male","female","others"].includes(value)){
               throw new Error("Gender data is not valid")
          }
         }

    },
    photoUrl:{
     type:String,
     default:"https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png",
      validate(value){
          if(!validator.isURL(value)){
               throw new Error("invalid photo URL");
          }
         }
    },
    about:{
     type:String,
     default:"this is the default about the user"
    },
    skills:{
     type:[String]
    }
},{timestamps:true})

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;