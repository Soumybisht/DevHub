
const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://soumybisht:fMYz66lmbfGl6ldC@soumycluster.eqj6klj.mongodb.net/DevHub");
};

module.exports = connectDB;