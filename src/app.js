const express = require("express");

const app = express();


// in postman use api = http://localhost:3000/user?userId=101
app.get("/user",(req,res)=>{
    console.log(req.query);
    res.send("call made using get method");
});

app.post("/user/:id/:name",(req,res)=>{
    console.log(req.params);
    res.send("call made using post method");
});

app.delete("/user",(req,res)=>{
    res.send("call made using delete method");
});

app.patch("/user",(req,res)=>{
    res.send("call made using patch method");
});

app.use("/user",(req,res)=>{

    res.send("Hello using use method");
});

app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000");
});