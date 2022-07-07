const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const Profile=require('../../models/Profile');
//api endpoint: api/profile

//gets a lint of all profiles (public)
router.get('/',(req,res)=>{
    res.send("connected to profile endpoint")
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
    try{
        let profile=await Profile.findOne({user:req.user.user_id});
        if(!profile){
            if(!errors.isEmpty())
            return res.status(500).json({errors:errors.array()});
            let profileFields=buildProfile(req.body);
            profileFields.user=req.user.user_id;
            //console.log(profileFields);
            let newProfile=await Profile.create(profileFields);
            return res.json("new profile created successfully");
        }
        else{
            res.send("profile already present,updating it");
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
        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        return res.status(401).json({errors:[{message:err.message}]});
    }
})

module.exports=router;