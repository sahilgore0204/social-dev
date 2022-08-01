const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const Profile=require('../../models/Profile');
const User=require('../../models/Users');
const axios=require('axios');
const Posts = require('../../models/Posts');
require('dotenv').config();
//api endpoint: api/profile

//gets a list of all profiles (public)
router.get('/',async (req,res)=>{
    try{
        let allProfiles=await Profile.find().populate('user',['name','email','avatar']);
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
        res.json({errors:[{message:"Profile not found"}]});
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
        return res.json({errors:errors.array()});
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
        res.json({errors:[{message:err.message}]});
    }
})

//api for getting loggedIn user's profile (private)
router.get('/me',auth,async (req,res)=>{
    try{
        let user=req.user.user_id;
        let profile=await Profile.findOne({user}).populate('user',['name','email']);
        if(!profile)
        res.json({errors:[{message:"profile doesn't exists"}]})
        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        return res.json({errors:[{message:err.message}]});
    }
})

//api to delete all stuff related to user(user,profile,posts)(private)

router.delete('/',auth,async (req,res)=>{
    try{
        let profile=await Profile.findOneAndRemove({user:req.user.user_id});
        if(!profile)
        return res.send("user deleted already");
        let posts=await Posts.deleteMany({user:req.user.user_id})
        let user=await User.findByIdAndRemove(req.user.user_id);
        return res.send("User deleted successfully");
    }
    catch(err){
        console.log(err.message);
        res.json({errors:[{"message":err.message}]});
    }
})

//api endpoint to add user experience(private)
// at a time only single experience is sent to the server

router.put('/experience',[auth,[
    check('title').not().isEmpty(),
    check('company').not().isEmpty(),
    check('from').not().isEmpty(),
    check('current','Current required').not().isEmpty()
]],async (req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors:errors.array()});
    }
    try{
        let user=req.user.user_id;
        let profile=await Profile.findOne({user});
        //here also same bug
        if(!profile)
        return res.json({errors:[{"message":"User doesn't exists"}]});
        profile.experience.unshift(req.body);
        //console.log(profile);
        await profile.save();
        res.send("experience added successfully");
    }
    catch(err){
        console.log(err);
        res.json({errors:[{"message":err.message}]});
    }
})

//api for deleteing experience through experience_id;
//endpoint: api/profile/experience/:experience_id (delete)
//private

router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try{
        let profile =await Profile.findOne({user:req.user.user_id});

        //find experience with given id;
        //console.log(profile);
        let exp=profile.experience.find(exp=>exp.id==req.params.exp_id);
        if(!exp)
        throw Error("Experience with given id doesn't exists");
        let expIndex=profile.experience.indexOf(exp);
        profile.experience.splice(expIndex,1);
        await profile.save();
        res.json("experience deleted successfully");
    }
    catch(err){
        console.log(err.message);
        return res.json({errors:[{"message":err.message}]});
    }
})

//api for adding a education(private)
router.put('/education',[auth,[
    check('school','School name is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('from','Starting  date required').not().isEmpty(),
    check('current','Current required').not().isEmpty()
]],async (req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty())
    return res.json({errors:errors.array()});
    try {
        let profile=await Profile.findOne({user:req.user.user_id});
        profile.education.unshift(req.body);
        await profile.save();
        res.send('education added successfully');
    } catch (error) {
        console.log(error);
        res.json({errors:[{"message":error.message}]});
    }
})

//api to delete education from id(private)

router.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
        let id=req.params.edu_id;
        let profile=await Profile.findOne({user:req.user.user_id});
        let edu=profile.education.find(edu_item=>edu_item.id==id);
        if(!edu)
        throw Error("Education with given id doesn't exists");
        let eduIndex=profile.education.indexOf(edu);
        profile.education.splice(eduIndex,1);
        await profile.save();
        res.send("education deleted successfully");
    } catch (error) {
        console.log(error);
        res.json({errors:[{"message":error.message}]});
    }
})

//api to get a users repo's from github through githubusername
//public(anyone can view any users repo)
//user on befalf of whom request is send must first generate the access token for our application to make authenticated request(Oauth apps)

router.get('/github/:username',async (req,res)=>{
    try {
        let code=req.query.code;
        let userName=req.params.username;
        if(!code){
            //get the code;
            //console.log("geeting code");
            let redirect_uri=`http://localhost:5000/api/profile/github/${userName}`;
            let getCodeUrl=`https://github.com/login/oauth/authorize?client_id=${process.env.github_client_id}&redirect_uri=${redirect_uri}`;
            res.redirect(getCodeUrl);
        }
        else{
            //get the access token and then send authenticated request to /users/{username}/repos;
            let response=await axios.get('https://github.com/login/oauth/access_token',{
                headers:{
                    'Accept':'application/json'
                },
                params:{
                    code:code,
                    client_id:process.env.github_client_id,
                    client_secret:process.env.github_client_secret
                }
            });
            let access_token=response.data.access_token;
            //res.send(access_token);
            let getRepoUrl=`https://api.github.com/users/${userName}/repos`;
            let repoResponse=await axios.get(getRepoUrl,{
                headers:{
                    'Accept':'application/vnd.github+json',
                    'Authorization':`token ${access_token}`
                }
            });
            res.json(repoResponse.data);
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json({errors:[{"message":err.message}]});
    }
})
module.exports=router;