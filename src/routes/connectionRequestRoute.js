const { userAuth } = require("../middlewares/auth");

const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequestRouter = express.Router();


//API to getConnectionRequest
connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Wrong status type: "+status);
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId:fromUserId,
            toUserId:toUserId,
            status:status,
        });

        const data = await connectionRequest.save();
        res.json({
            message:"Request sent successfully",
            data,
        })

    }catch(err){
        res.status(400).send("Invalid Connection request: "+err.message);
    }
});


module.exports = {connectionRequestRouter};