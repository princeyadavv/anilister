const mongoose = require('mongoose')
const showSchema = mongoose.Schema({
name:{
    type:String,
    required:"true"
},
type:{
    type:String,
    enum:["ANIME","MANGA"],
    required:true

},
status:{
    type:String,
    enum:["WATCHLIST","FINISHED"],
    required:true
},
rating:{
    type:Number,
    required: true
},
stars:{
    type:String,
},
color:{
    type:String,
}
,
createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
}
},{ timestamps: true })

const show = mongoose.model('show',showSchema)
module.exports = show