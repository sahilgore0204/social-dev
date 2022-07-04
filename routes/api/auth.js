const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');

//api endpoint api/auth

//api to verify jwt
router.get('/',auth,(req,res)=>{
    console.log(req.user);
    res.send("connected to auth endpoint")
})

module.exports=router;