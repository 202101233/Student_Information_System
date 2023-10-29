const express = require("express");
const dotenv=require("dotenv");
const morgan=require("morgan");
const bodyparser=require("body-parser");
const path=require("path");
const bcrypt=require('bcrypt');
const validatePhoneNumber = require('validate-phone-number-node-js');
const validator = require("email-validator");


const connectDB=require("./Server/Database/connection");

dotenv.config({path : 'config.env'});
const app=express();

//const PORT = process.env.PORT|| 8080;

//log request
//app.use(morgan('tiny'));

//mongoDB connection
connectDB();

//parser request to body-parsar
app.use(bodyparser.urlencoded({extended : true}))

//set view engine
app.set("view engine", "ejs")

app.use(methodOverride("_method"));

//load assets
app.use('/css',express.static(path.resolve(__dirname,"Assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"Assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"Assets/js")))

//load router
app.use('/', require('./Server/Routes/router'));

app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;


app.listen(PORT, ()=> {console.log(`Server is running on http://localhost:${PORT}`)});