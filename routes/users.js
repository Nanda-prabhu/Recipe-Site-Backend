const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/Users");
require("dotenv").config();

const router = express.Router();


router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if(user) {
        return res.status(409).json({"message":"UserName already exists!"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({username, password: hashedPassword});
    await newUser.save();
    res.status(200).json({"message":"User registed successfully!"});
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if(!user) {
        return res.status(404).json({"message":"User does not exist!"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(404).json({"message":"Username or password is invalid!"});
    }

    const token = jwt.sign({id: user._id}, process.env.SECRET);
    res.status(200).json({token, userID: user._id});

});

module.exports = router;


// // middleware to verify users
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         jwt.verify(token, process.env.SECRET, (err) => {
//             if (err) return res.sendStatus(403);
//             next();
//         });
//     }
//     else {
//         res.sendStatus(401);
//     }
// }

// module.exports = verifyToken;
