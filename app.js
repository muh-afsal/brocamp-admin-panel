const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/Admin-panel").then(()=>{
    console.log('db connteced')
}).catch(()=>{
    console.log('err');
})

const express=require("express")
const app=express();

const nocache = require("nocache");
app.use(nocache());


//for user route 
const userRoute=require("./routes/userRouter")
app.use("/",userRoute)

//for admin route 
const adminRoute=require("./routes/adminRouter")
app.use("/admin",adminRoute)

app.use(express.static("public"))


app.listen(3000,()=>{
    console.log('server has started on http://localhost:3000');
}) 