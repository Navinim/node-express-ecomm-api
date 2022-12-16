const mongoose = require("mongoose")
const uuidv1=require('uuidv1')
const crypto=require('crypto')

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    hashed_password:{
        type:String,required:true
    },
    role:{
        type:Boolean,
        default:0
    },
    img:{type:String},
    salt:String,
    isVerified:{
        type:Boolean,
        default:false
    }
  
},
{timestamps:true}
);
//virtual field
userSchema.virtual('password')
.set(function(password){
    this._password=password
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})
//defining the method
userSchema.methods={
    authenticate:function(plainText){
        return this.encryptPassword(plainText)===this.hashed_password
    },
    encryptPassword:function(password){
        if(!password) return ''
        try{
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }catch(err){
            return ''
        }
    }
}

module.exports=mongoose.model("User",userSchema)