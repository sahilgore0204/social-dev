import React, { useContext,useReducer,useState } from "react";
import AuthContext from "../context/auth-context";
import Protect from "../auth/Protect";
import { Link } from "react-router-dom";
import axios from "axios";
import Errors from "../Errors";
export default function AddEducation() {
    const auth = useContext(AuthContext);
    function reduce(currentInfo,action){
        if(action.type==='update'){
            const {name,value}=action.payload;
            return {...currentInfo,[name]:value};
        }
        if(action.type==='update-to')
        return {...currentInfo,to:''};
    }
    let eduFields=['school','degree','fieldOfStudy','from','to','description'];
    const [current,setCurrent]=useState(false);
    const [errMessage,setErrMessage]=useState('');
    const [eduInfo,dispatch]=useReducer(reduce,{school:'',degree:'',fieldOfStudy:'',from:'',to:'',description:''});
    function buildEduData(data){
        let cleanData={};
        for(let keyInd in eduFields){
            let key=eduFields[keyInd];
            let len=data[key].length;
            if(len)
            cleanData[key]=data[key];
        }
        cleanData['current']=current;
        return cleanData;
    } 
    async function handleSubmit(event){
        event.preventDefault();
        //console.log(eduInfo);
        let cleanData=buildEduData(eduInfo);
        //console.log(cleanData);
        //make a put request to api/profile/education
        let data=JSON.stringify(cleanData);
        let config={
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':auth.jwt
            }
        }
        try {
            let response=await axios.put('http://localhost:5000/api/profile/education',data,config);
            if(response.data.errors)
            throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            setErrMessage('');
            console.log(response.data);
        } catch (err) {
            console.log(err.message);
            setErrMessage(err.message);
        }
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
                Add Your Education
            </h1>
            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="* School or Bootcamp"
                        name="school"
                        value={eduInfo.school}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={handleChange}
                        placeholder="* Degree or Certificate"
                        name="degree"
                        value={eduInfo.degree}
                        required
                    />
                </div>
                <div className="form-group">
                    <input onChange={handleChange} type="text" placeholder="Field Of Study" name="fieldOfStudy" value={eduInfo.fieldOfStudy} />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input onChange={handleChange} type="date" name="from" value={eduInfo.from} />
                </div>
                <div className="form-group">
                    <p>
                        <input onChange={()=>{setCurrent(!current);dispatch({type:'update-to'})}} type="checkbox" name="current" value={current} /> Current School or Bootcamp
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input onChange={handleChange} type="date" name="to" value={eduInfo.to} disabled={current} required={!current} />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Program Description"
                        value={eduInfo.name}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </section>
    )
}