import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';



const userSchema = new Schema({
    fullName: {
        type: String,
        require: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    userName: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        require: [true, 'Password is required']
    },
    avatar:{
        type: String,
        default: ""
    },
    refreshToken: {
        type: String
    },
    roll:{
        type: String,
        default: 'user'
    },
    gender: {
        type: String,
         default: ""
    },
    marital_status: {
        type: String,
         default: ""
    },
    date_of_Birth: {
        type: String,
         default: ""
    },
    nationalID: {
        type: String,
         default: ""
    },
    religion: {
        type: String,
         default: ""
    },
    emergency_contact: {
        type: String,
         default: ""
    }
},{timestamps: true});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password= await bcrypt.hash(this.password, 10)
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model('User', userSchema)