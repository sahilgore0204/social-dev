const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const User=require('../../models/Users');
const jwt=require('jsonwebtoken');
require('dotenv').config();
//api endpoint api/auth

//api to verify jwt
router.get('/',auth,(req,res)=>{
    console.log(req.user);
    res.send("connected to auth endpoint")
})

//post api for Log-Inning the user

router.post('/',[
    check('email','Enter a valid email').isEmail(),
    check('password','Password is required').exists()
],async (req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors:errors.array()});
    }
    try{
        let {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({errors:[{'message':"Invalid credentials"}]});
        }
        let compare=await bcrypt.compare(password,user.password);
        if(!compare){
            return res.status(401).json({errors:[{'message':"Invalid credentials"}]});
        }
        let payload={
            user_id:user.id
        }
        let id_token=jwt.sign(payload,process.env.jwtSecret,{
            expiresIn:3600000
        })
        res.send(id_token);
    }
    catch(err){
        console.log(err);
        res.status(401).json({errors:[{'message':err.message}]});
    }
})

module.exports=router;