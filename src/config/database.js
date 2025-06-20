const mongoose=require("mongoose");

const connectDB=async()=>{
  //  await mongoose.connect("mongodb://localhost:27017/DEVTINDER");
  await mongoose.connect("mongodb+srv://medicinestore:sumeya@cluster0.orapy1c.mongodb.net/DevTinder")
};

module.exports=connectDB;