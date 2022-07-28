import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Developers() {
    const [profileDetails, setProfileDetails] = useState([]);
    useEffect(() => {
        //make a req to get la list of all the profiles to api/profile
        const fetchAllProfiles = async () => {
            try {
                let response = await axios.get('http://localhost:5000/api/profile');
                setProfileDetails(response.data)
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchAllProfiles();
    }, []);
    return (
        <section className="container">
            <h1 className="large text-primary">Developers</h1>
            <p className="lead">
                <i className="fab fa-connectdevelop"></i> Browse and connect with developers
            </p>
            <div className="profiles">
                {profileDetails.length!==0 && profileDetails.map((profile, ind) => {
                    return (
                        <div key={ind} className="profile bg-light">
                            <img
                                className="round-img"
                                src={profile.user.avatar}
                                alt=""
                            />
                            <div>
                                <h2>{profile.user.name}</h2>
                                <p>{profile.status} at {profile.company}</p>
                                <p>{profile.location}</p>
                                <a href="profile.html" className="btn btn-primary">View Profile</a>
                            </div>

                            <ul>
                                {profile.skills.map((skill, ind) => {
                                    return (
                                        <li key={ind} className="text-primary">
                                            <i className="fas fa-check"></i> {skill}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}