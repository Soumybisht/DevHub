const { userAuth } = require("../middlewares/auth");

const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequestRouter = express.Router();
const User = require("../models/user");

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

        const duplicateRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}],
        });
        if(duplicateRequest){
            return res.status(400).send("Connection Request already exits");
        }

        const existingUser = await User.findById(toUserId);
        if(!existingUser){
            return res.status(404).send("User not found");
        }

        if(fromUserId.equals(toUserId)){
            return res.status(500).json({
                message:"Cannot send request to self"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
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

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        const allowedAction = ["accepted","rejected"];
        if(!allowedAction.includes(status)){
            return res.status(400).send("Invalid action");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        });

        if(!connectionRequest){
            return res.status(400).send("Cannot accept request: ");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message:"Request "+status,
            data,
        })

    }catch(err){
        res.status(400).send("Something went wrong "+err.message);
    }

})



module.exports = {connectionRequestRouter};