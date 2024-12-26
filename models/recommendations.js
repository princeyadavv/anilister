const mongoose = require('mongoose')
const playlist = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"show"
        }
    ],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }],
    createdBy:[{
        type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }]
    ,
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

const recommendation = mongoose.model('recommendation',playlist)
module.exports= recommendation