const express = require('express');
const { User } = require('../models/user');
const {Message} = require('../models/message');
const { auth} = require('../middleware/auth');
const config = require('../config/config').get(process.env.NODE_ENV);


const credentials ={
    apiKey: 'UZOdGxj2iAYUV-2UqkZp7qveu4GsjzA69ePddPuS',
    username: 'Pantech'
}
const AT = require('africastalking')(credentials);
const sms = AT.SMS;

//const roles = require('user-groups-roles');//

const router = express.Router();




/*route to render login page for testing//
router.get('/api/login', async (req, res)=>{
    res.sendFile(__dirname + "/html/login.html");
});*/

/*router.get('/api/auth',auth, async (req,res)=>{
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
}); */

//route to register a user to the system//
router.post('/api/register', async (req,res)=>{
    try{
        //checking to see if user already exists in database by searching for email//
        const user = await User.findOne({'email':req.body.email});
         if(user) return res.status(400).send({error: 'user already exists'})

         //checking if username has already been taken//
        const userName = await User.findOne({'username':req.body.username});
         if(userName) return res.status(400).send({error: 'username already taken'})

        const   NewUser = new User(req.body);

        //saving new user details in database//
        NewUser.save((err,doc)=>{
            if(err) return res.json({success:false});
            res.status(200).json({
                success:true,
                user:doc
            })
        })
    }catch(err){
        throw(err);
    }
})

//route to login a user into the system//
router.post('/api/login', async (req,res)=>{
    try{
        //checking to see if username exists in database//
        const user = await User.findOne({'username':req.body.username})
        if(!user) return res.json({isAuth:false, message:'Auth failed, username not found'})

        //implementing method to compare user password with the one in the database//
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong password'
            });

            //implementing method to generate token to authenticate user//
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('auth',user.token).json({
                    isAuth:true,
                    id:user._id,
                    username:user.username
                })
            })
        })
    }catch(err){
        throw(err);
    }
})

//route to logout user//
router.get('/api/logout',auth, async (req,res)=>{
    try{
        req.user.deleteToken(req.token,(err,user)=>{
            if(err) return res.status(400).send(err);
            res.sendStatus(200)
        })
    }catch(err){
        throw(err);
    }

})

router.post('/api/sendMessage',async (req, res)=>{
    try{
        const message = "This message is from Mawuli. I am testing the software's messaging route. Thanks";

        const phoneNumbers = ['+233505527839','+233501096351','+233502729026'];
        const options = {
            to: phoneNumbers,
            message: message
        }

        sms.send(options).then(
                res.status(200).json({
                    success: 'Message sent succcessfully'
                })
        )

    }catch(err){
        res.status(400).json({success: 'messsage not sent'})
    }

})

module.exports = router;

