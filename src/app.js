const express= require('express');
const app=express();
const {adminAuth,userAuth}=require('./middlewares/auth.js');


app.use('/admin',adminAuth);

app.use('/user',userAuth,(req,res)=>{
    res.send("user data sent succesfully");
})

app.get('/admin/getalldata',(req ,res)=>{
    res.status(200).send("all data sent");
})

app.delete('/admin/deletedata',(req,res)=>{
    res.status(200).send("all data delete");
})



app.listen(3000,()=>{
    console.log("server is running on port 3000");
})