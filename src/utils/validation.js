{/*const validator=require('validator');
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

module.exports={validatesignup};*/}
