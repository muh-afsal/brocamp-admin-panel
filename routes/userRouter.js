const express=require('express')
const user_router=express();
const bodyParser=require('body-parser')
const session=require("express-session")
const config=require("../config/config")

const userController=require("../controller/userController")

//handling session
user_router.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))
 const auth=require("../Middleware/auth")



//setting engine
user_router.set("view engine","ejs")
user_router.set('views','./views/users')

//setting bodyparser
user_router.use(bodyParser.json())
user_router.use(express.urlencoded({extended:true}))




//routers
user_router.get('/signup',auth.islogout,userController.loadsignup)
user_router.post('/signup',userController.insertuser)
user_router.get('/',auth.islogout,userController.loginLoad)
user_router.get('/login',auth.islogout,userController.loginLoad)
user_router.post('/login',userController.verifylogin)
user_router.get('/home',auth.islogin,userController.loadhome)
user_router.get('/logout',auth.islogin,userController.userLogout)








module.exports=user_router