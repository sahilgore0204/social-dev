const express=require('express');
const router=express.Router();


//api endpoint api/user
router.get('/',(req,res)=>{
    res.send("connected to user endpoint")
})

module.exports=router;