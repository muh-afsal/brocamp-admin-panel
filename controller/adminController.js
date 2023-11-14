const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const { ObjectId } = require("mongodb");

//load login
const loadLogin = async (req, res) => {
  try {
    res.render("adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};

//securing password

const securepassword = async (password) => {
  try {
    const passwordhash = await bcrypt.hash(password, 10);
    return passwordhash;
  } catch (error) {
    console.log(error.message);
  }
};

//verify login
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.admin_id = userData._id;
        res.redirect("/admin/home");
      } else {
        res.render("adminlogin", { message: "Incorrect Username or Password" });
      }
    } else {
      res.render("adminlogin", { message: "Incorrect Username or Password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//load admin home

const loadDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 }).sort({ date: -1 });
    // console.log(usersData);
    res.render("adminhome", { usersData });
  } catch (error) {
    console.log(error.message);
  }
};

//admin logout
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};
//------adding new-users-----
//add user load

const addUserLoad = async (req, res) => {
  try {
    res.render("addUser");
  } catch (error) {
    console.log(error.message);
  }
};

//adding user

const addUser = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.toLowerCase();
    const phoneNo = req.body.phoneNo;
    const password = randomString.generate(8);
    const secpassword = await securepassword(password);

    if (!name || !email || !phoneNo ) {
      throw "All fields are required...";
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.render("addUser", { message: "Email already exists" });
    } else {
      const user = new User({
        name: name,
        email: email,
        phoneNo: phoneNo,
        password: secpassword,
        is_admin: 0,
        date: Date.now(),
      });

      const userData = await user.save();

      if (userData) {
        res.redirect("/admin/home");
      } else {
        res.render("addUser", { message: "Something Wrong..." });
      }
    }
  } catch (error) {
    res.render("addUser", { message:error });  }
};

//edit user details
const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("editUser", { user: userData });
    } else {
      res.redirect("/admin/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//updating user details
//updating user details
const updateUser = async (req, res) => {
  try {
    // Update the user details here
    const userData = await User.findByIdAndUpdate(
      { _id: new ObjectId(req.body.id) },
      { name: req.body.name, email: req.body.email, phoneNo: req.body.phone }
    );

    if (userData) {
      // If the update is successful, redirect to the appropriate page
      res.redirect("/admin/home");
    } else {
      // If the update fails, render an error message
      res.render("errorPage", { message: "Update failed" });
    }
  } catch (error) {
    console.log(error.message);
    // Handle the error and render an error message
    res.render("errorPage", { message: "An error occurred" });
  }
};


//deleting user
const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/home");
  } catch (error) {
    console.log(error.message);
  }
};

//adding search
const searchUsers = async (req, res) => {
  try {
    const query = req.query.search;
    const regex = new RegExp("^" + query, "i");

    const usersData = await User.find({
      $or: [{ name: { $regex: regex } }],
      is_admin: 0,
    });

    res.render("adminhome", { usersData });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  adminLogout,
  addUserLoad,
  addUser,
  editUserLoad,
  updateUser,
  deleteUser,
  searchUsers,
};
