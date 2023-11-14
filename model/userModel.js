const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNo:{
        type:Number,
        // required:true
    },
    is_admin:{
        type:Number,
        required:true,
        default:0
    },
    date:{
        type:Date
    }
     
})
//making model and exporting
module.exports=mongoose.model('User',userSchema) 