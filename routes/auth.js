const express = require("express");
const router = express.Router();
const { userCollection } = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {isUserLoggedIn} = require("./middlewares");
require("dotenv").config();
const { validationResult } = require("express-validator");


require("dotenv").config(); // Load environment variables from .env file

router.post("/register", async (req, res) => {
  

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const user = await userCollection.create({
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    });

    // Generate a JWT for the registered user using the JWT secret from .env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login route
router.post("/login", async (req, res) => {

  try {

   const {email, password} = req.body;
   console.log("Login request received with email:", email);

   // Find user by email
   const user = await userCollection.findOne({ email: email });
   console.log("User found:", user);
   if (!user) {
     return res.status(404).json({ error: "User not found" });
   }

  // Check if decoded user ID is available
    // if (!req.decoded || !req.decoded.userId) {
    //   console.log("Decoded User ID not available");
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
    
    
// ;
//compare password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log("Password Match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT for the logged-in user using the JWT secret from .env

    const {email:userEmail, _id, role} = user
    const token = jwt.sign({ 
      email: userEmail,
      userId: _id,
      role: role
    }, process.env.JWT_SECRET);

    res.send({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/profile", isUserLoggedIn, async (req, res) => {
  try {
    const user = await userCollection.findById(req.decoded.userId, "-password");
    res.send(user);
    
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
    
  }


})

module.exports = router;
