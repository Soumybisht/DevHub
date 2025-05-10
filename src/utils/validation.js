const validator = require("validator");

const validateData = (req)=>{

    const {emailId} = req?.body; //you can make validations for all the fields

    if(!validator.isEmail(emailId)){
        throw new Error("Not a valid Email");
    }
}

module.exports = {
    validateData,
}