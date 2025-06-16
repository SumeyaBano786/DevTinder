const adminAuth=(req,res,next)=>{
    const token="xyz";
    const isauthorized= token ==="xyz";
    if(!isauthorized){
        res.status(401).send("admin is not authorized");
    }
    else{
        next();
    }
}

const userAuth=(req,res,next)=>{
    const token="xyz";
    const isauthorized= token ==="xyz";
    if(!isauthorized){
        res.status(401).send("admin is not authorized");
    }
    else{
        next();
    }
}


module.exports={
    adminAuth,userAuth
}