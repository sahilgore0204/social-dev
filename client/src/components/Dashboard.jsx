import React,{useContext,useEffect,useState} from "react";
import { Link,Navigate } from "react-router-dom";
import AuthContext from "./context/auth-context";
import Protect from "./auth/Protect";
import axios from "axios";
import Experience from "./Experience";
export default function DashBoard() {
    const auth=useContext(AuthContext);
    let [profileDetails,setProfileDetails]=useState({});
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
    },[]); 
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

            
            {profileDetails.experience && <Experience experienceData={profileDetails.experience}/>}
            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Northern Essex</td>
                        <td className="hide-sm">Associates</td>
                        <td className="hide-sm">
                            02-03-2007 - 01-02-2009
                        </td>
                        <td>
                            <button className="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="my-2">
                <button className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>

                    Delete My Account
                </button>
            </div>
        </section>
    );
}