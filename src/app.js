const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ✅ CORS config
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] // ✅ must include PATCH
}));

// ✅ Body & Cookie parsers
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const { authRouter } = require("./routes/authRoute");
const { profileRouter } = require("./routes/profileRoute");
const { connectionRequestRouter } = require("./routes/connectionRequestRoute");
const userRouter = require("./routes/userRoute");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

// ✅ Start server
const connectDB = require("./config/database");
connectDB().then(() => {
  console.log("connection established successfully");
  app.listen(3000, () => {
    console.log("Server is running successfully on port 3000");
  });
}).catch(() => {
  console.log("connection to database failed");
});
