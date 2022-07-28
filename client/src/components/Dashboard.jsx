import React,{useContext,useEffect,useState} from "react";
import { Link,Navigate } from "react-router-dom";
import AuthContext from "./context/auth-context";
import Protect from "./auth/Protect";
import axios from "axios";
import Experience from "./Experience";
import EducationDisplay from "./EducationDisplay";
export default function DashBoard() {
    const auth=useContext(AuthContext);
    let [profileDetails,setProfileDetails]=useState({});
    let [reFetch,setReFetch]=useState(false);
    useEffect(()=>{
        const fetchProfile=async ()=>{
            const config={
                headers:{
                    'x-auth-token':auth.jwt
                }
            }
            try {
                let response=await axios.get('http://localhost:5000/api/profile/me',config);
                if(!response.data.errors){
                    setProfileDetails(response.data);
                    console.log(profileDetails);
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchProfile();
    },[reFetch]); 
    async function handleClick(){
        console.log('deleting account');
        let config={
            headers:{
                'x-auth-token':auth.jwt,
            }
        }
        let url='http://localhost:5000/api/profile';
        try {
            let response=await axios.delete(url,config);
            if(response.data.errors)
            throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            auth.setJwt('');

        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <section className="container">
            <Protect jwt={auth.jwt} />
            <h1 className="large text-primary">
                Dashboard
            </h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome {profileDetails.user && profileDetails.user.name}</p>
            <div className="dash-buttons">
                <Link to='/edit-profile' className="btn btn-light"><i className="fas fa-user-circle text-primary"></i> Edit Profile</Link>
                <Link to='/add-experience' className="btn btn-light"><i className="fab fa-black-tie text-primary"></i> Add Experience</Link>
                <Link to='/add-education' className="btn btn-light"><i className="fas fa-graduation-cap text-primary"></i> Add Education</Link>
            </div>

            
            {profileDetails.experience && <Experience experienceData={profileDetails.experience} refetch={reFetch} setRefetch={setReFetch} jwt={auth.jwt}/>}
            {profileDetails.education && <EducationDisplay educationData={profileDetails.education} refetch={reFetch} setRefetch={setReFetch} jwt={auth.jwt}/>}
            <div className="my-2">
                <button onClick={handleClick} className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>

                    Delete My Account
                </button>
            </div>
        </section>
    );
}