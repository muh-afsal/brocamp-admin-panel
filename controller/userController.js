const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const session = require("express-session");

//securing password

const securepassword = async (password) => {
  try {
    const passwordhash = await bcrypt.hash(password, 10);
    return passwordhash;
  } catch (error) {
    console.log(error.message);
  }
};

//load sign up
const loadsignup = async (req, res) => {
  try {
    res.render("signup");
    // res.send("hia")
  } catch (error) {
    console.log(error.message);
  }
};

//insert user

const insertuser = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email=req.body.email.toLowerCase();
    const phoneNo = req.body.phoneNo;
    const secpassword = await securepassword(req.body.password);

    if (!name || !email || !phoneNo || !secpassword ) {
      // throw "All fields are required...";
      res.render("signup", { message: "All fields are required..." });
    }
     
     
    //cheak email already exist or not
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.render("signup", { message: "Email already exists" });
    }else{
    const user = new User({
      name: req.body.name.trim(),
      email: req.body.email,
      phoneNo:req.body.phoneNo,
      password: secpassword,
      is_admin: 0,
      date: Date.now(),
    });
    const userData = await user.save();

    if (userData) {
      res.render("login", { message: "Sign up succesful, Now please login" });
    } else {
      res.render("signup", { message: "Your have failed to Signed Up" });
    }
  }
  } catch (error) {
    console.log(error.message);
  }
};

// ---->user login methords

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
//login verifying

const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("login", { message: "Incorrect Username or Password" });
      }
    } else {
      res.render("login", { message: "Incorrect Username or Password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//load home
const loadhome = async (req, res) => {
  try {
    res.render("home", { title: "Home page" });
  } catch (error) {
    console.log(error.message);
  }
};

//user logout
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadsignup,
  insertuser,
  loginLoad,
  verifylogin,
  loadhome,
  userLogout,
};
