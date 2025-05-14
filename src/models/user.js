const mongoose = require("mongoose");
const validator = require("validator");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        maxLength:20,
        minLength:3,
    },
    lastName: {
        type: String,
        required:true,
        maxLength:20,
        minLength:3,
    },
    emailId: {
        type: String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email address");
            }
        }

    },
    password: {
        type: String,
        minLength:8,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min:18,

    },
    gender: {
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("wrong gender type");
            }
        }
    },
    photo: {
        type:String,
        default:"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL address");
            }
        }

    },
    about: {
        type: String,
        default: "This is the default text for the description of the user",
    },
    skills: {
        type: [String],
    }

},{timestamps:true});


userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jsonWebToken.sign({_id:user.id},"secretKey",{expiresIn:"1d"});

    return token;
}

userSchema.methods.bcryptPass =async function (userPassword){
    const user = this;
    const passwordHash = user.password;

    const validatePassword = await bcrypt.compare(userPassword,passwordHash);
    return validatePassword;
}


module.exports = mongoose.model("User",userSchema);
