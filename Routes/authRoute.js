const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/FetchUser');

const JWT_SECRET = 'Shahzaibisagoodb$oy';


//endpoint to create user
router.post("/createuser",[
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    body('isAdmin','user will not admin')
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
        let check_user = await User.findOne({ username: req.body.username });
        if (check_user) {
          return res.status(400).json({ error: "Sorry a user with this name already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        check_user = await User.create({
          username: req.body.username,
          password: secPass,
          isAdmin: req.body.isAdmin,
        });
        const data = {
          user: {
            id: check_user._id
          }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })
      } catch (error) {
        res.status(500).send({error: error.message});
      }
});

//endpoint to login user
router.post('/login', [
  body('username', 'Enter a valid username').isLength({ min: 3 }),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let isAdmin = "";
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  console.log(req.body)
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
    // const data = {
    //   user: {
    //     id: user._id
    //   }
    // }
    let userId = user._id
    isAdmin = user.isAdmin
   // console.log(data.user.id);
  //  const authtoken = jwt.sign(userId, JWT_SECRET);
   // res.json({user,isAdmin, authtoken })
   res.status(200).send({isAdmin,id: userId})

  } catch (error) {
    res.status(500).send({error: error.message});
  }

});

// //Change name 
// router.post("/changeusername",async(req,res)=>{

//   try {
//     const data = await User.findOne({_id: req.body.id });
//     console.log(data);
  
//       const salt = await bcrypt.genSalt(10);

//       const securePass = await bcrypt.hash(req.body.password, salt);

//       const userData = await Director.findByIdAndUpdate(
//         { _id: data._id },
//         { $set: { password: securePass} },
//         { new: true }
//       );
//       res
//         .status(200)
//         .send({
//           successMessage: 'Your password has been updated'
//         });
//   } catch (error) {
//     res.status(500).send({
//       errorMessage: [error]
//     })
//   }


// });

// //endpoint to access all the users except the user who's is currently logged in!
router.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } }).select("-password")
    .then((users) => {
      res.status(200).json({users: users});
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ error: "Error retrieving users" });
    });
});

//enpoint Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get('/getuser/:id',  async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    res.send({data: user})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// //endpoint to change username
router.post("/change-username/:id",
body('username', 'Enter a valid username').isLength({ min: 3 }),
fetchuser,async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const data = await User.findOne({_id: req.params.id });
    console.log(data);
      const userData = await User.findByIdAndUpdate(
        { _id: data._id },
        { $set: { username: req.body.username} },
        { new: true }
      );
      res
        .status(200)
        .send({
          successMessage: 'Your username has been updated'
        });
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});
// //endpoint to change password
// router.post('/change-password',[
//   body('username', 'Enter a valid username').isLength({ min: 3 }),
//   body('oldPassword', 'Old password must be atleast 5 characters').isLength({ min: 5 }),
//   body('newPassword', 'New Password must be atleast 5 characters').isLength({ min: 5 }),
// ],fetchuser,async(req, res) => {

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ error: errors.array() });
//   }
//   try {
//     const { username, oldPassword, newPassword } = req.body;
//    // const user = await User.findOne(user => user.username === username);
//    const user = await User.findOne({username: username});
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const isValidPassword = bcrypt.compareSync(oldPassword, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid old password' });
//     }
//     const salt = await bcrypt.genSalt(10);
  
//     const securePass = await bcrypt.hash(newPassword, salt);
  
//     const userData = await User.findByIdAndUpdate(
//       { _id: user._id },
//       { $set: { password: securePass} },
//       { new: true }
//     );
//     res
//       .status(200)
//       .send({
//         message: 'Your password has been updated'
//       });
    

//   } catch (error) {
//     res.status(400).send({error: error.message})
//   }
// });
// //endpoint to delete the user
// router.delete("/delete-user/:id",fetchuser,async(req,res)=>{
// try {
//   const { id } = req.params;
//   const user = await User.findByIdAndDelete(id);
//   if (!user) {
//     return res.status(400).json({error: "User not found"});
//   }
//   res.status(200).json({message: "User deleted successfully"});

// } catch (error) {
//   res.status(400).send({error: error.message})
// }
// });

//   } catch (error) {
//     res.status(400).send({error: error.message})
//   }
// });
//endpoint to delete the user
router.delete("/delete-user/:id",fetchuser,async(req,res)=>{
try {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(400).json({error: "User not found"});
  }
  res.status(200).json({message: "User deleted successfully"});

} catch (error) {
  res.status(400).send({error: error.message})
}
});


module.exports = router;
