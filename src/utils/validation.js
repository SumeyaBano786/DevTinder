const validator=require('validator');
const User=require('../models/user');
//const { validate } = require('../models/user');

const validatesignup=(req)=>{
    const{firstName,lastName,password,emailId}=req.body;
    if(!firstName || !lastName){
        throw new Error("full name is required");
    }
    else if(firstName.length<3 || firstName.length>50){
        throw new Error("name should be between 3 to 50");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("please enter a  valid mail ");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");

    }
}


const validateupdate=(req)=>{

    const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills","firstName","lastName"];

    const isupdateallowed=Object.keys(req.body).every((field)=>
        ALLOWED_UPDATES.includes(field)
    );
    return isupdateallowed;


}
module.exports={validatesignup,validateupdate};
