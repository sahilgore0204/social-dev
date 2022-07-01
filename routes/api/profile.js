const express=require('express');
const router=express.Router();


//api endpoint api/profile
router.get('/',(req,res)=>{
    res.send("connected to profile endpoint")
})

module.exports=router;