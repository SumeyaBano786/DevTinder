const jwt=require('jsonwebtoken');
 const secretKey="#1240"

const userAuth=async(req,res,next)=>{
      const token=req.cookies.token;
       if(!token){
      return  res.send("token is missing");
    }
    try{
        
    const decoded=jwt.verify(token,secretKey);
    req.user=decoded;
   
    next();

    }catch(error){
        res.send(error.message);
    }
  


}

module.exports=userAuth;