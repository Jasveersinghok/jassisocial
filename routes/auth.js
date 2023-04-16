const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//Registraton
router.post("/register", async (req, res) => {
  try {
    //hasing the password
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hanshedPasowrd = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hanshedPasowrd,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.json("some error occured")
  }
});

//Login
router.post("/login", async (req, res) => {
  const {email,password} = req.body;
  try {
   const user = await User.findOne({email})
   !user && res.status(404).json("user not found")
    // if user found

    const validPassword = await bcrypt.compare(user.password,password)
   !user && res.status(400).json("wrong credentials")
     res.status(200).json(user);
  } catch (error) {
    console.log(error + " new error occureed");
  }
});

module.exports = router;
