//middleware to verify jwt's and store the jwt info in req, so that there is no need to verify in subsequent requests
const jwt=require('jsonwebtoken');
const User=require('../models/Users');
require('dotenv').config();
async function authMiddleware(req,res,next){
    try{
        let id_token=req.headers['x-auth-token'];
        let payload=jwt.verify(id_token,process.env.jwtSecret);
        //console.log(payload);
        let user=await User.findById(payload.user_id);
        if(!user){
            throw Error("User with given jwt doesn't exists,please register first");
        }
        req.user=payload;
        next();
    }
    catch(err){
        console.log(err.message);
        res.json({"errors":[{
            "message":err.message
        }]})
    }
}

module.exports=authMiddleware;