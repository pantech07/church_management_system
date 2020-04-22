const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const usersRoutes = require('./Routes/user');
const memberDetailsRoutes = require('./Routes/memberDetails');
const accountsRoutes = require('./Routes/accounts');
const app = express();
const passport = require('passport');


//connecting the API to monogoose database//
mongoose.connect(config.DATABASE, {useNewUrlParser: true})
.then(() => {console.log("Mongodb connected")})
.catch(err => {console.log(err)});

//specifying ways to pass our data//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); 

// USER ROUTES //
app.use('/', usersRoutes);

// MEMBER DETAILS ROUTES//
app.use('/', memberDetailsRoutes);

// ACCOUNTS ROUTES//
app.use('/', accountsRoutes);

//defining the port for the API// 
const port = process.env.PORT || 5000 ;
app.listen(port,()=>{
    console.log(`SERVER RUNNNING`)
})