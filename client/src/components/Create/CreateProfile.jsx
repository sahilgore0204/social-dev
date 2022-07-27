import React, { useContext,useReducer,useState,useEffect } from "react";
import AuthContext from "../context/auth-context";
import Protect from "../auth/Protect";
import { Link } from "react-router-dom";
import Errors from '../Errors'
import axios from "axios";
export default function CreateProfile() {
    let profileFields=['bio','company','githubUserName','location','skills','status','website'];
    let socialLinks=['youtube','instagram','twitter','facebook','linkedIn'];

    function buildProfileData(data,where){
        //returns clean data, chopping off the fields with 0 length value
        let cleanData={};

        if(where==='server'){
            //data has been fetched from server
            //here there will be no field having 0 length or size
            //we need to destructure social and skills
            //console.log(data);
            for(let keyInd in profileFields){
                let key=profileFields[keyInd];
                //console.log(data[key]);
                if(data[key]){
                    //console.log(data[key]);
                    if(key==='skills'){
                        //console.log(data[key]);
                        let temp='';
                        for(let skill in data[key])
                        temp+=(data[key][skill]+',');
                        cleanData[key]=temp.substring(0,temp.length-1);
                    }
                    else{
                        cleanData[key]=data[key];
                    }
                }
                else
                cleanData[key]='';
            }
            for(let keyInd in socialLinks){
                let key=socialLinks[keyInd];
                if(data.social[key])
                cleanData[key]=data.social[key];
                else
                cleanData[key]='';
            }
        }
        else if(where==='client'){
            //console.log(data);
            //data is from client
            //here there can be fields with 0 length or size, we dont need to consider them
            for(let keyInd in profileFields){
                let key=profileFields[keyInd];
                let len=data[key].length;
                if(len){
                    //console.log(data[key])
                    cleanData[key]=data[key];
                }
            }
            for(let keyInd in socialLinks){
                let key=socialLinks[keyInd];
                if(data[key].length!==0)
                cleanData[key]=data[key];
            }
        }
        return cleanData;
    }
    function reduce(currState,action){
        if(action.type==='update')
        return {...currState,[action.payload.name]:action.payload.value}
        else if(action.type==='update-all')
        return action.payload
    }
    const [errMessage,setErrMessage]=useState('');
    const auth=useContext(AuthContext);

    //adding default state value is ok here because I am cleaning the data in both the condition
    const [profileInfo,dispatch]=useReducer(reduce,{bio:'',company:'',website:'',skills:'',status:'',location:'',githubUserName:'',youtube:'',facebook:'',twitter:'',instagram:'',linkedIn:''});
    function handleChange(event){
        const {name,value}=event.target;
        let action={
            type:'update',
            payload:{
                name,
                value
            }
        }
        dispatch(action);
    }
    async function handleSubmit(event){
        event.preventDefault();
        let cleanData=buildProfileData(profileInfo,'client');
        console.log(cleanData);
        //post request to api/profile
        let data=JSON.stringify(cleanData);
        let config={
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':auth.jwt
            }
        }
        try {
            let response=await axios.post('http://localhost:5000/api/profile',data,config);
            console.log(response.data);
            if(response.data.errors){
                throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            }
            setErrMessage('');
        } catch (err) {
            console.log(err.message);
            setErrMessage(err.message);
        }
    }
    //async always returns a promise, useEffect callback should not return anything except the clean-up function(if you want)
    useEffect(()=>{
        //user can also try to update the profile if already existentent
        //fetch it and diplay the prefilled form
        const initialFetch=async ()=>{
            const config={
                headers:{
                    'x-auth-token':auth.jwt
                }
            }
            try {
                let response=await axios.get('http://localhost:5000/api/profile/me',config);
                if(!response.data.errors){
                    //response.data is already parsed into object/array;
                    let data=buildProfileData(response.data,'server');
                    //console.log(data);
                    dispatch({type:'update-all',payload:data});
                }
            } catch (err) {
                console.log(err.message);
            }
        };
        initialFetch();
    },[]);
    return (
        <section className="container">
            <Protect jwt={auth.jwt} />
            {errMessage.length!==0 && <Errors resetError={setErrMessage}>{errMessage}</Errors>}
            <h1 className="large text-primary">
                Create Your Profile
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i> Let's get some information to make your
                profile stand out
            </p>
            <small>* = required field</small>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <select name="status" onChange={handleChange} value={profileInfo.status.length && profileInfo.status}>
                        <option value="0">{profileInfo.status.length?profileInfo.status:'* Select Professional Status'}</option>
                        <option value="Developer">Developer</option>
                        <option value="Junior Developer">Junior Developer</option>
                        <option value="Senior Developer">Senior Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Student or Learning">Student or Learning</option>
                        <option value="Instructor">Instructor or Teacher</option>
                        <option value="Intern">Intern</option>
                        <option value="Other">Other</option>
                    </select>
                    <small className="form-text">Give us an idea of where you are at in your career</small>
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="Company" name="company" value={profileInfo.company} />
                    <small className="form-text">Could be your own company or one you work for</small>
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="Website" name="website" value={profileInfo.website} />
                    <small className="form-text">Could be your own or a company website</small>
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="Location" name="location" value={profileInfo.location} />
                    <small className="form-text">City & state suggested (eg. Mumbai,Maharashtra)</small>
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="* Skills" name="skills" value={profileInfo.skills} />
                    <small className="form-text">Please use comma separated values (eg.HTML,CSS,JavaScript,PHP)</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubUserName"
                        onChange={handleChange}
                        value={profileInfo.githubUserName}
                    />
                    <small className="form-text">If you want your latest repos and a Github link, include yourusername</small>
                </div>
                <div className="form-group">
                    <textarea onChange={handleChange} placeholder="A short bio of yourself" name="bio" value={profileInfo.bio}></textarea>
                    <small className="form-text">Tell us a little about yourself</small>
                </div>

                <div className="my-2">
                    <button type="button" className="btn btn-light">
                        Add Social Network Links
                    </button>
                    <span>Optional</span>
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-twitter fa-2x"></i>
                    <input onChange={handleChange} type="text" placeholder="Twitter URL" name="twitter" value={profileInfo.twitter} />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-facebook fa-2x"></i>
                    <input onChange={handleChange} type="text" placeholder="Facebook URL" name="facebook" value={profileInfo.facebook} />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-youtube fa-2x"></i>
                    <input onChange={handleChange} type="text" placeholder="YouTube URL" name="youtube" value={profileInfo.youtube} />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-linkedin fa-2x"></i>
                    <input onChange={handleChange} type="text" placeholder="Linkedin URL" name="linkedIn" value={profileInfo.linkedIn} />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-instagram fa-2x"></i>
                    <input onChange={handleChange} type="text" placeholder="Instagram URL" name="instagram" value={profileInfo.instagram} />
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </section>
    )
}