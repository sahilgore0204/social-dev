import React, { useContext,useReducer,useState } from "react";
import AuthContext from "../context/auth-context";
import Protect from "../auth/Protect";
import { Link } from "react-router-dom";
import Errors from "../Errors";
import axios from "axios";
export default function AddExperience() {
    const auth = useContext(AuthContext);
    function reduce(currentExperience,action){
        if(action.type==='update'){
            const {name,value}=action.payload;
            return {...currentExperience,[name]:value}
        }
        else if(action.type==='update-to'){
            return {...currentExperience,to:''};
        }
    }
    let experienceFields=['title','company','from','to','location','description'];
    const [errMessage,setErrMessage]=useState('');
    const [experienceData,dispatch]=useReducer(reduce,{title:'',company:'',from:'',to:'',location:'',description:''})
    const [current,setCurrent]=useState(false);
    function buildExperienceData(data){
        let cleanData={};
        for(let keyInd in experienceFields){
            let key=experienceFields[keyInd];
            let len=data[key].length;
            if(len)
            cleanData[key]=data[key];
        }
        cleanData['current']=current
        return cleanData;
    }
    async function handleSubmit(event){
        event.preventDefault();
        let cleanData=buildExperienceData(experienceData);
        console.log(cleanData);
        //put request to api/profile/experience
        let config={
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':auth.jwt
            }
        }
        let data=JSON.stringify(cleanData);
        try {
            let response=await axios.put('http://localhost:5000/api/profile/experience',data,config);
            if(response.data.errors){
                throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            }
            setErrMessage('');
            console.log(response.data);
        } catch (err) {
            console.log(err.message);
            setErrMessage(err.message);
        }
        //console.log(experienceData)
    }
    function handleChange(event){
        const {name,value}=event.target;
        dispatch({type:'update',payload:{name,value}});
    }
    return (
        <section className="container">
            <Protect jwt={auth.jwt} />
            {errMessage.length!==0 && <Errors resetError={setErrMessage}>{errMessage}</Errors>}
            <h1 className="large text-primary">
                Add An Experience
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="* Job Title" name="title" value={experienceData.title} required />
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="* Company" name="company" value={experienceData.company} required />
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="Location" name="location" value={experienceData.location} />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input onChange={handleChange} type="date" name="from" value={experienceData.from} />
                </div>
                <div className="form-group">
                    <p><input onChange={()=>{setCurrent(!current);dispatch({type:'update-to'})}} type="checkbox" name="current" value={current} /> Current Job</p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input onChange={handleChange} type="date" name="to" disabled={current} required={!current} value={experienceData.to} />
                </div>
                <div className="form-group">
                    <textarea
                        onChange={handleChange}
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Job Description"
                        value={experienceData.description}
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </section>
    )
}