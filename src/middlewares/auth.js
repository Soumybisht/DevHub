const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");

const userAuth = async (req,res,next)=>{

    
    try{
        
        const {token} = req.cookies;

        if(!token){
            throw new Error("Token expired or Invalid");
        }

        const decodedTokenValue = jsonWebToken.verify(req.cookies.token,"secretKey");
        console.log(decodedTokenValue);
        const user = await User.findOne({_id:decodedTokenValue._id});
        req.user = user;
        next();

    }catch(err){
        res.status(404).send("Please Login again");
    }
};

module.exports = {
    userAuth,
}