const User = require("../models/user");
const bcrypt = require("bcrypt");
const {validateData} = require("../utils/validation"); 

const express = require("express");

const authRouter = express.Router();



// API for signing up user inserting data into the database
authRouter.post("/signup",async (req,res)=>{

    try{

    //validation of api data using helpers
    validateData(req);

    const {firstName,lastName,emailId,password,age,gender} = req?.body;


    //Hashing password
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);

    // creating a new instance of the User mmodel
    const user = new User({
        firstName,lastName,emailId,password:passwordHash,age,gender
    });
    
        if((req.body)?.skills.length>10){
            throw new Error("Skills number should be less than 10");
        }
        await user.save();
        res.send("user created successfully");
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }

});


//API for loging In and checking for emailId and password
authRouter.post("/login",async (req,res)=>{

    try{
    const {emailId,password} = req.body;

    const user = await User.findOne({emailId:emailId});

    if(!user){
        throw new Error("Invalid User credentials");
    }
    const validUser = await user.bcryptPass(password);

    if(validUser){

        const token = await user.getJWT();
        res.cookie("token",token,{expires: new Date(Date.now()+7*3600000)});
        res.send("Login Successfull");

    }else{
        res.status(404).send("Invalid User credentials");
    }


    }catch(err){
        res.status(500).send("Login Failed: "+err.message);
    }
});

//API to logout
authRouter.post("/logout",async (req,res)=>{

    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged Out Successfully");

});

module.exports = {authRouter};
