const express=require('express');
const router=express.Router();


//api endpoint api/posts
router.get('/',(req,res)=>{
    res.send("connected to posts endpoint")
})

module.exports=router;