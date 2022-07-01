const express=require('express');
const router=express.Router();


//api endpoint api/auth
router.get('/',(req,res)=>{
    res.send("connected to auth endpoint")
})

module.exports=router;