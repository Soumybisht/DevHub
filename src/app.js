const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const {authRouter} = require("./routes/authRoute");
const {profileRouter} = require("./routes/profileRoute");
const {connectionRequestRouter} = require("./routes/connectionRequestRoute");
const userRouter = require("./routes/userRoute");

app.use(express.json());
app.use(cookieParser());


//Calling routers/APIs
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);
app.use("/",connectionRequestRouter);
app.use("/",userRouter);


connectDB().then(()=>{
    console.log("connection established successfully");
    app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000");
});
}).catch(()=>{
    console.log("connection to database failed");
})

