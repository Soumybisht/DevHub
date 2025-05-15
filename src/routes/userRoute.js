const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName","lastName","age","gender","skills","photo","about"];

userRouter.get("/user/request/received",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);

        const data = receivedRequests.map((con)=>con.fromUserId);

        res.json({
            message:"Requests received successfully",
            data
        })

    }catch(err){
        res.status(400).send("Something went wrong");
    }

});

userRouter.get("/user/connections",userAuth,async (req,res)=>{
try{

    const loggedInUser = req.user;

    const getConnections = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id,status:"accepted"},
            {toUserId:loggedInUser._id,status:"accepted"},
        ]
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

    const data = getConnections.map((con)=>{
        if(con.fromUserId.toString() === loggedInUser._id.toString()){
            return con.fromUserId;
        }
        else{
            return con.toUserId;
        }
    });
    res.json({
        message:"Connections fetched successfully",
        data
    });

}catch(err){
    res.status(400).send("Cannot get the requests at the moment");
}
})

module.exports = userRouter;