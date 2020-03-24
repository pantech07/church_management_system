const express = require('express');
const { Member } = require('../models/member');
const { auth} = require('../middleware/auth');

const router = express.Router();

//route to add details of new church member//
router.post('/api/add_member', auth,(req,res)=>{
    try{
        const member = new Member(req.body)

    //saving member details in database    
    member.save((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            post:true,
            MemberId: doc.ID
        })
    })
    }catch(err){
        throw(err);
    }
})

//route to search for existing member by id//
router.post('/api/search_member', auth,(req,res)=>{
    try{
        Member.findOne({'ID':req.body.ID},(err,member)=>{
            if(!member) return res.json({message:'Member not found'});
            res.send(member)
        })
    }catch(err){
        throw(err);
    }
})

//route to update or edit details of existing member//
router.post('/api/update_member', auth,(req,res)=>{
    try{
        Member.findOneAndUpdate(req.body.ID,req.body,{new:true},(err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json({
                success:true,
                doc
            })
        })
    }catch(err){
        throw(err);
    }

})

//route to delete all details of a member//
router.delete('/api/delete_member', auth,(req,res)=>{
   try{
    Member.findOneAndRemove(req.body.ID,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json({
            success: true,
            doc
        })
    })
   }catch(err){
       throw(err);
   }
})


module.exports = router;