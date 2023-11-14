const express=require('express')
const admin_route=express()
const adminController=require("../controller/adminController")

const config=require('../config/config')
const session=require('express-session')

admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))

const bodyParser=require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(express.urlencoded({extended:true}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const auth=require('../Middleware/adminAuth')



admin_route.get('/',auth.islogout,adminController.loadLogin) 
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/home',auth.islogin,adminController.loadDashboard)
admin_route.get('/logout',auth.islogin,adminController.adminLogout) 
admin_route.get('/addUser',auth.islogin,adminController.addUserLoad)
admin_route.post('/addUser',adminController.addUser)
admin_route.get('/editUser',auth.islogin,adminController.editUserLoad)
admin_route.post('/editUser',adminController.updateUser)
admin_route.get('/deleteUser',adminController.deleteUser)
admin_route.get('/search', auth.islogin, adminController.searchUsers);

admin_route.get('*',(req,res)=>{
    res.redirect("/admin/")
})
module.exports=admin_route 