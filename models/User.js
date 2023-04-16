const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  profilePicture: {
    type: String,
    defalut: "",
  },
  coverPicture: {
    type: String,
    defalut: "",
  },
  followers:{
    type:Array,
    default:[]
  },
  followings:{
    type:Array,
    default:[]
  },
  isAdmin:{
    type:Boolean,
    defalut:false
  },
  desc:{
    type:String,
    max:50,
  },
  city:{
    type:String,
    max:50,
  },
  from:{
    type:String,
    max:50,
  },
  relationshiptatus:{
   type:String,
   enum:["single","commited"]
  },
},
{timestamps:true}
);

module.exports = mongoose.model("User",UserSchema)
