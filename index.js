const express = require("express");
require('dotenv').config()
const db=require('./database/connection')
const cors = require("cors");
const morgan=require('morgan')
const expressValidator=require('express-validator')
const cookieParser=require('cookie-parser')

const authRoute=require("./routes/authRoute");
const productRoute =require("./routes/productRoute");

const orderRoute =require("./routes/orderRoute");
const categoryRoute =require("./routes/categoryRoute");


const app = express();

//middleware
app.use(express.json());
app.use(cors()) 
app.use('/public/uploads',express.static('public/uploads'))
app.use(morgan('dev'))
app.use(expressValidator())
app.use(cookieParser())

//Routes
app.use("/api/v1",authRoute); 
app.use("/api/v1",productRoute);
app.use("/api/v1",orderRoute);
app.use("/api/v1",categoryRoute);

//server setup
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running...on:"+process.env.PORT)
});
