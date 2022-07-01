const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');

//api endpoint api/user
//for registering users

router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','enter a valid email').isEmail(),
    check('password','password should be more than 6 characters').isLength({min:6})
],(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    res.send("connected to user endpoint")
})

module.exports=router;