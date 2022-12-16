const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const orderSchema= new mongoose.Schema({
    orderItems:[{
        type:ObjectId,
        ref:'OrderItem',
        required:true
    }],
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String
        
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    status:{type:String,default:"pending",required:true},
    amount:{type:Number,required:true},
    user:{
        type:ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model('Order',orderSchema)