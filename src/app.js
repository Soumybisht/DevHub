const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {validateData} = require("./utils/validation"); 
const cookieParser = require("cookie-parser");
const jsonWebToken  = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// API for signing up user inserting data into the database
app.post("/signup",async (req,res)=>{
   
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
app.post("/login",async (req,res)=>{

    try{
    const {emailId,password} = req.body;

    const user = await User.findOne({emailId:emailId});

    if(!user){
        throw new Error("Invalid User credentials");
    }
    const validUser = await bcrypt.compare(password,user.password);

    if(validUser){

        const id = user._id;
        const token = jsonWebToken.sign({_id:id},"secretKey",{expiresIn:"1d"});
        res.cookie("token",token,{expires: new Date(Date.now()+7*3600000)});
        res.send("Login Successfull");

    }else{
        res.status(404).send("Invalid User credentials");
    }


    }catch(err){
        res.status(500).send("Login Failed: "+err.message);
    }
});


//API to get Profile data for a logged in user
app.get("/profile",userAuth,async (req,res)=>{

    try{
        res.send(req.user);

    }catch(err){
        res.status(404).send("Please Login Again");
    }
})

//API to getConnectionRequest
app.get("/connectionRequest",userAuth,(req,res)=>{

    const {firstName} = req.user;
    res.send(firstName+" sent a request");
})


//API to update user data
app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{

        const allowedUpdates = ["firstName","lastName","about","photo","gender","skills"];

        const isUpdated = Object.keys(data).every((k)=>{
            return allowedUpdates.includes(k);
        })
        if(!isUpdated){
            throw new Error("Update is not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Skills number should be less than 10");
        }

        const user = await User.findOneAndUpdate({_id:userId},data,{returnDocument:"before",runValidators:true});
        res.send("user updated successfully");
    }catch(err){
        res.status(500).send("Update Failed: "+err.message);
    }
    
})

connectDB().then(()=>{
    console.log("connection established successfully");
    app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000");
});
}).catch(()=>{
    console.log("connection to database failed");
})

