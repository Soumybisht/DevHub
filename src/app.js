const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

// API for signing up user inserting data into the database
app.post("/signup",async (req,res)=>{

    //console.log(req.body);
    // creating a new instance of the User mmodel
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user created successfully");
    }catch(err){
        res.status(400).send("something went wrong");
    }

});

// API for getting user data by using their emialId
app.get("/user",async (req,res)=>{

    const userEmail = req.body.emailId;

    try{
        const user = await User.find({emailId:userEmail});
        if(user.length===0){
        res.status(404).send("User not found");
        }
        else{
        res.send(user);
        }
    }
    catch(err){
        res.status(404).send("User not found");
    }

}) 


// API to get feed data - get data of all the users in database
app.get("/feed",async (req,res)=>{

    try{
        const user = await User.find();
        if(user.length===0){
        res.status(404).send("User not found");
        }
        else{
        res.send(user);
        }
    }
    catch(err){
        res.status(404).send("User not found");
    }

})

//API to delete the user data by finding userId
app.delete("/user",async (req,res)=>{

    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        res.send("user deleted successfully");
    }catch(err){
        res.status(500).send("error");
    }
})

//API to update user data
app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findOneAndUpdate({_id:userId},data,{returnDocument:"before"});
        res.send("user updated successfully");
    }catch(err){
        res.status(500).send("error");
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

