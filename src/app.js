const express = require("express");

const app = express();


app.use("/user",(req,res)=>{

    res.send("Hello Users");
});

app.use("/",(req,res)=>{

    res.send("Hello");
});

app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000");
});