const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../../models/Users');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
//api endpoint api/user
//for registering users

//user registration (creating a new user happens here)
//upon successful registration we return a jwt containing user_id as its payload;
// we dont redirect the request to login url, because there also we don the same thing.

router.post('/',[
    check('name','name is required').not().isEmpty(),//checks if non zero size name exists
    check('email','enter a valid email').isEmail(),//for valid email
    check('password','password should be more than 6 characters').isLength({min:6})//password size shold me min 6
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors:errors.array()});
    }
    //lets check if user with email already exists
    //email should be unique as we use it to uniquely identfy user
    //even if you are using username, email should be unique for communication purposes
    let {name,email,password}=req.body
    try{
        const user=await User.findOne({email:email});
        //console.log(user);
        if(user){
            //console.log("y");
            return res.json({"errors":[
                {
                    "message":"User already exists"
                }
            ]});
        }
        // grab the gravatar url
        let avatar=gravatar.url(email,{
            's':'200',
            'd':'wavatar',
            'r':'pg'
        });

        //hash the password befire saving it ,also use the salt for hashing

        //generating a salt
        let salt=await bcrypt.genSalt(10);

        //using the salt to hash the password

        password=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            name,
            email,
            password,
            avatar
        });

        //console.log(newUser);
        //upon successfull registration, return a jwt with user_id as a payload.

        //creating and signing a jwt with my secret key;
        let payload={
            user_id:newUser.id
        }
        let id_token=jwt.sign(payload,process.env.jwtSecret,{
            expiresIn:3600000
        });

        res.send(id_token);
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({"errors":[
            {
                "message":err.message
            }
        ]});

    }
    //res.send("connected to user endpoint")
})

module.exports=router;