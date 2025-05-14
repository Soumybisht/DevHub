const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const express = require("express");
const profileRouter = express.Router();

//API to get Profile data for a logged in user
profileRouter.get("/profile",userAuth,async (req,res)=>{

    try{
        res.send(req.user);

    }catch(err){
        res.status(404).send("Please Login Again");
    }
});

//API to update user data
profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    const data = req?.body;
    try{

        const allowedUpdates = ["firstName","lastName","about","photo","gender","skills"];

        const isUpdated = Object.keys(data).every((k)=>{
            return allowedUpdates.includes(k);
        })
        if(!isUpdated){
            throw new Error("Invalid Update format"); 
        }
        if(data?.skills.length>10){
            throw new Error("Skills number should be less than 10");
        }

        const user = req.user; 
        await User.findOneAndUpdate({_id:user._id},data,{returnDocument:"before",runValidators:true});
        res.send("user updated successfully");
    }catch(err){
        res.status(500).send("Update Failed: "+err.message);
    }
    
})


//API to update password and store
profileRouter.patch("/profile/passwordEdit",userAuth,async (req,res)=>{

    try{
    const data = req.body;
    const isAllowedUpdate = ["password"];
    const isUpdated = Object.keys(data).every((k)=>{
            return isAllowedUpdate.includes(k);
        })
        if(!isUpdated){
            throw new Error("Invalid Update format"); 
        }
    const {password} = req.body;
    const strongPass = validator.isStrongPassword(password);
    if(!strongPass){
        throw new Error("Please create a strong password");
    }

    const hashPass = await bcrypt.hash(password,10);
    const user = req.user;
    await User.findOneAndUpdate({_id:user._id},{password:hashPass},{returnDocument:"after",runValidators:true});
    res.send("Password Updated successfully");

    }catch(err){
        res.status(400).send("Cannot update password->"+err.message);
    }

});



module.exports = {profileRouter};