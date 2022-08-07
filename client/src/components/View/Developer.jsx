import axios from "axios";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
export default function Developer() {
    const { user_id } = useParams();
    //console.log(user_id);
    const [profile, setProfile] = useState();
    const [repoInfo, setRepoInfo] = useState();
    const access_token = document.cookie.split(';').find(cook => cook.startsWith('github'));
    //console.log(access_token);
    const token = access_token ? access_token.split('=')[1] : null;
    //console.log(token);
    useEffect(() => {
        const fetchProfile = async () => {
            const url = `http://localhost:5000/api/profile/user/${user_id}`;
            try {
                const response = await axios.get(url);
                if (response.data.errors)
                    throw Error(response.data.errors[0].message || response.data.errors[0].msg);
                setProfile(response.data);
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchProfile();
    }, []);
    //if token is and profile.githubUserName both are present then only make github api request
    //if token is not present display login link
    //token available but profile.githubUserName is not present, show No data exists
    useEffect(() => {
        const fetchGithubProfile = async () => {
            if (!profile)
                return;
            const githubUserName = profile.githubUserName;
            if (token === null || !githubUserName)
                return;
            console.log('now fetching');
            const url = `https://api.github.com/users/${githubUserName}/repos`
            const config = {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `token ${token}`
                }
            }
            try {
                const response = await axios.get(url, config);
                setRepoInfo(response.data);
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchGithubProfile();
    }, [profile]);
    return (
        <section className="container">
            {profile && <Fragment>
                <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>

                <div className="profile-grid my-1">
                    {/* <!-- Top --> */}
                    <div className="profile-top bg-primary p-2">
                        <img
                            className="round-img my-1"
                            src={profile.user.avatar}
                            alt=""
                        />
                        <h1 className="large">{profile.user.name}</h1>
                        <p className="lead">{profile.status} {profile.company && `at ${profile.company}`}</p>
                        {profile.location && <p>{profile.location}</p>}
                        <div className="icons my-1">
                            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-globe fa-2x"></i>
                            </a>}
                            {profile.social && <Fragment>
                                {
                                    profile.social.twitter && <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-twitter fa-2x"></i>
                                    </a>
                                }
                                {profile.social.facebook && <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook fa-2x"></i>
                                </a>}
                                {profile.social.linkedIn && <a href={profile.social.linkedIn} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin fa-2x"></i>
                                </a>}
                                {profile.social.youtube && <a href={profile.social.youtube} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-youtube fa-2x"></i>
                                </a>}
                                {profile.social.instagram && <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram fa-2x"></i>
                                </a>}
                            </Fragment>}
                        </div>
                    </div>

                    {/* <!-- About --> */}
                    <div className="profile-about bg-light p-2">
                        <h2 className="text-primary">{profile.user.name.split(" ")[0]}'s Bio</h2>
                        <p>
                            {profile.bio}
                        </p>
                        <div className="line"></div>
                        <h2 className="text-primary">Skill Set</h2>
                        <div className="skills">
                            {profile.skills.map((skill, ind) => {
                                return <div key={ind} className="p-1"><i className="fa fa-check"></i>{skill}</div>
                            })}
                        </div>
                    </div>

                    {/* <!-- Experience --> */}
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.experience.length ? <Fragment>
                            {profile.experience.map((exp, ind) => {
                                return <div key={ind}>
                                    <h3 className="text-dark">{exp.company}</h3>
                                    <p>{exp.from.substring(0, 10)} - {exp.to ? exp.to.substring(0, 10) : 'Current'}</p>
                                    <p><strong>Position: </strong>{exp.title}</p>
                                    {exp.description && <p>
                                        <strong>Description: </strong>{exp.description}
                                    </p>}
                                </div>
                            })}
                        </Fragment> : 'Data not availble'}
                    </div>

                    {/* <!-- Education --> */}
                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {profile.education.length ? profile.education.map((edu, ind) => {
                            return (<div key={ind}>
                                <h3>{edu.school}</h3>
                                <p>{edu.from.substring(0, 10)} - {edu.to ? edu.to.substring(0, 10) : 'Current'}</p>
                                <p><strong>Degree: </strong>{edu.degree}</p>
                                {edu.fieldOfStudy && <p><strong>Field Of Study: </strong>{edu.fieldOfStudy}</p>}
                                {edu.description && <p>
                                    <strong>Description: </strong>{edu.description}
                                </p>}
                            </div>)
                        }) : 'Data not available'}
                    </div>

                    {/* <!-- Github --> */}
                    <div className="profile-github">
                        <h2 className="text-primary my-1">
                            <i className="fab fa-github"></i> Github Repos
                        </h2>
                        {token === null && <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_github_client_id}&state=${user_id}`}>Login to your github account for viewing this information</a>}
                        {token!==null && !repoInfo && 'No data available'}
                        {repoInfo && repoInfo.map((repo, ind) => {
                            return <div key={ind} className="repo bg-white p-1 my-1">
                                <div>
                                    <h4><a href={repo.html_url} target="_blank"
                                        rel="noopener noreferrer">{repo.name}</a></h4>
                                    <p>
                                        {repo.description?repo.description:"No description"}
                                    </p>
                                </div>
                                <div>
                                    <ul>
                                        <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                                        <li className="badge badge-dark">Watchers: {repo.watchers}</li>
                                        <li className="badge badge-light">Forks: {repo.forks}</li>
                                    </ul>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </Fragment>}
        </section>
    )
}