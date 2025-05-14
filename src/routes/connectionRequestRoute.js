const { userAuth } = require("../middlewares/auth");

const express = require("express");
const connectionRequestRouter = express.Router();


//API to getConnectionRequest
connectionRequestRouter.get("/connectionRequest",userAuth,(req,res)=>{

    const {firstName} = req.user;
    res.send(firstName+" sent a request");
});


module.exports = {connectionRequestRouter};