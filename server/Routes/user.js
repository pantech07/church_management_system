const express = require('express');
const { User } = require('../models/user');
const { auth} = require('../middleware/auth');
const roles = require('user-groups-roles');

const router = express.Router();

//USER ROLES//

router.get('/api/login', async (req, res)=>{
    res.sendFile(__dirname + "/html/login.html");
});

router.get('/api/auth',auth, async (req,res)=>{
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
});

router.post('/api/register', async (req,res)=>{
    try{
        const user = await User.findOne({'username':req.body.username});
         if(user) return res.status(400).send({error: 'user already exists'})
        const   NewUser = new User(req.body);

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

router.post('/api/login', async (req,res)=>{
    try{
        const user = await User.findOne({'username':req.body.username})
        if(!user) return res.json({isAuth:false, message:'Auth failed, username not found'})

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong password'
            });

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

module.exports = router;

