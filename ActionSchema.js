const mongoose = require("mongoose");

const today=()=>{
    const date= new Date()
    const day=date.getDate()
    const month=date.getMonth()+1
    const year=date.getFullYear()
    console.log(`${day}/${month}/${year}`)
    return `${day}/${month}/${year}`
}

const ActionSchema = new mongoose.Schema({
    date:{
        type:Date,
        default: today()
    },
    actionType :{
        type:String,
        required: [true, "no actionType"],
        lowercase: true,
        enum:["deposit","withdraw"]

    },
    account :{
        type:String,
        trim:true,
        unique:true,
        validate:{
            validator:(account)=>{const chek=new mongoose.Schema().findOne({id:account})
                return chek?true:false
            }
        }

    },
    amount:{
        type:Number,
        min:0.1
    }
})



module.exports = mongoose.model("Action", ActionSchema);
