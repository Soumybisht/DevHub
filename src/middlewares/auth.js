const adminAuth = (req,res,next)=>{
    console.log("middleware is authenticating the admin")
    const token = "abc";
    const authToken = token === "abc";

    if(authToken){
        next();
    }
    else{
        res.status(401).send("Unauthorized request");
    }
};

const userAuth = (req,res,next)=>{
    console.log("middleware is authenticating the user")
    const token = "abc";
    const authToken = token === "abc";

    if(authToken){
        next();
    }
    else{
        res.status(401).send("Unauthorized request");
    }
};

module.exports = {
    adminAuth,userAuth
}