const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    id: {
        type:String,
        required: [true, "no id"],
        trim:true,
        unique:true
    },
        credit :{
        type: Number,
        min:0,
        default:0
    },
    cash :{
        type: Number,
        min:0,
        default:0
    },
    isActive :{
        type: Boolean,
        default: true
    },
    
})

module.exports = mongoose.model("Account", AccountSchema);

