const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg:{
      type: String,
    },
    
    liked: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    bio:{
      type : String,
      default :'Hello dear'
    },
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre('save',function(next){
  const user = this
  if(!user.isModified("firstName")) return
  const firstLetter = user.firstName.charAt(0).toLowerCase();
 const path = `/profileimg/${firstLetter}.png`
 user.profileImg = path
  next()
})
const User = model('user', userSchema);


module.exports = User;
