import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const UserSchema=new mongoose.Schema({
  name:{ type:String,required:[true,'Please Provide Name'],maxLength:50,minLength:3},
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
},{
  timestamps:true
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.createJWT=function(){
  return jwt.sign({ userId:this._id, userName:this.name},process.env.JWT_SECRET,{expiresIn:'30d'})
}

UserSchema.methods.comparePassword=async function(canditatePassword){
  const isMatch=await bcrypt.compare(canditatePassword,this.password);
  return isMatch;
}

const UserModel=mongoose.model('User',UserSchema);

export default UserModel;