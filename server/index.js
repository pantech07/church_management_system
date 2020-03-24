const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const usersRoutes = require('./Routes/user');
const memberDetailsRoutes = require('./Routes/memberDetails');
const app = express();

//connecting the API to monogoose database//
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE)

//specifying ways to pass our data//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


// USER ROUTES //
app.use('/', usersRoutes);

// MEMBER DETAILS ROUTES//
app.use('/', memberDetailsRoutes);

//defining the port for the API// 
const port = process.env.PORT || 5000 ;
app.listen(port,()=>{
    console.log(`SERVER RUNNNING`)
})