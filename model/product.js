const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category'
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 1,
        max: 5
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema)