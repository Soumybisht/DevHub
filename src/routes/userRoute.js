const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName","lastName","age","gender","skills","photo","about"];

userRouter.get("/user/request/received",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({
            message:"Requests received successfully",
            data:receivedRequests,
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

userRouter.get("/user/feed",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;
        const page = parseInt(req.query.page)|| 1;
        let limit = parseInt(req.query.limit)|| 10;
        limit = limit>30?30:limit;
        const skip = (page-1)*limit;

        //getting user connection data with any type of status by using login user ID as reference
        const userConnections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");


        //putting those users into a set to remove duplicate values of users
        const hideUsersOnFeed = new Set();
        userConnections.forEach((req)=>{
            hideUsersOnFeed.add(req.fromUserId.toString());
            hideUsersOnFeed.add(req.toUserId.toString());
        });
        
        //getting all users by filtering out hideUsers
        const showUsersOnFeed = await User.find({
            $and:[

                { _id:{  $nin: Array.from(hideUsersOnFeed)   }},
                { _id:{$ne:loggedInUser._id}}
            ]
            
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            message:"Feed loaded successfully",
            data:showUsersOnFeed
        });
       

    }catch(err){
        res.status(400).send("Error occured "+err.message);
    }
});

module.exports = userRouter;