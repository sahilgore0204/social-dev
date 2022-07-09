const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const Profile=require('../../models/Profile');
const User=require('../../models/Users');
//api endpoint: api/profile

//gets a list of all profiles (public)
router.get('/',async (req,res)=>{
    try{
        let allProfiles=await Profile.find().populate('user',['name','email']);
        return res.send(allProfiles);
    }
    catch(err){
        console.log(err);
    }
})

//get profile by user id(public)

router.get('/user/:user_id',async (req,res)=>{
    try{
        let profile=await Profile.findOne({user:req.params.user_id});
        if(!profile)
        throw Error("Profile not found");
        res.send(profile);
    }
    catch(err){
        console.log(err);
        res.status(401).json({errors:[{message:"Profile not found"}]});
    }
})

function buildProfile(postData){
    let {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubUserName,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedIn
    }=postData;
    let profile={};
    profile.social={};
    if(company)
    profile.company=company;
    if(website)
    profile.website=website;
    if(location)
    profile.location=location;
    if(status)
    profile.status=status;
    if(skills)
    profile.skills=skills.split(',').map(skill=>skill.trim());
    if(bio)
    profile.bio=bio;
    if(githubUserName)
    profile.githubUserName=githubUserName;
    if(youtube)
    profile.social.youtube=youtube;
    if(facebook)
    profile.social.facebook=facebook;
    if(twitter)
    profile.social.twitter=twitter;
    if(instagram)
    profile.social.instagram=instagram;
    if(linkedIn)
    profile.social.linkedIn=linkedIn;
    return profile;
}

//creates/updates logged In user's profile (private);
router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills are required').not().isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(500).json({errors:errors.array()});
    try{
        let profile=await Profile.findOne({user:req.user.user_id});
        if(!profile){
            //creating the profile
            let profileFields=buildProfile(req.body);
            profileFields.user=req.user.user_id;
            //console.log(profileFields);
            let newProfile=await Profile.create(profileFields);
            return res.json("new profile created successfully");
        }
        else{
            //updating the profile
            let user=req.user.user_id;
            let profileFields=buildProfile(req.body);
            let profile= await Profile.findOneAndUpdate({user},{$set:profileFields});
            res.send("profile updated successfully");
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({errors:[{message:err.message}]});
    }
})

//api for getting loggedIn user's profile (private)
router.get('/me',auth,async (req,res)=>{
    try{
        let user=req.user.user_id;
        let profile=await Profile.findOne({user}).populate('user',['name','email']);
        if(!profile)
        res.status(401).json({errors:[{message:"profile doesn't exists"}]})
        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        return res.status(401).json({errors:[{message:err.message}]});
    }
})

//api to delete all stuff related to user(user,profile,posts)(private)

router.delete('/',auth,async (req,res)=>{
    try{
        let profile=await Profile.findOneAndRemove({user:req.user.user_id});
        if(!profile)
        res.status(401).send("user deleted already");
        let user=await User.findByIdAndRemove(req.user.user_id);
        return res.send("User deleted successfully");
    }
    catch(err){
        console.log(err.message);
        res.status(401).json({errors:[{"message":err.message}]});
    }
})


module.exports=router;