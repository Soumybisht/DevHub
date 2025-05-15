const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId :{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type: String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message: `wrong message type`,
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;