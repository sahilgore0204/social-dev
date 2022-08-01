import React, { useContext, useEffect, useState } from "react";
import Errors from "../Errors";
import AuthContext from '../context/auth-context'
import axios from "axios";
import {Link} from 'react-router-dom'
export default function Posts() {
    let jwt = useContext(AuthContext).jwt;
    //console.log(jwt);
    const [postInfo, setPostInfo] = useState({ title: '', description: '' });
    const [errMessage, setErrorMessage] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [refetch, setRefetch] = useState(false);
    useEffect(() => {
        //fetch all the post from /api/posts
        const fetchPosts = async () => {
            try {
                let response = await axios.get('http://localhost:5000/api/posts');
                if (response.data.errors)
                    throw Error(response.data.errors[0].message || response.data.errors[0].message)
                console.log(response.data);
                setAllPosts(response.data);
                setErrorMessage('');
            } catch (err) {
                console.log(err.message);
                setErrorMessage(err.message);
            }
        }
        fetchPosts();
    }, [refetch]);


    async function handleClick(event) {
        const { name, id } = event.target
        console.log(name, id);
        if (jwt.length === 0) {
            setErrorMessage('Please Login first');
            return;
        }
        let url = '',response='';
        let config = {
            headers: {
                'x-auth-token': jwt
            }
        }
        try {
            if (name === 'like' || name === 'dislike') {
                url = `http://localhost:5000/api/posts/${name}/${id}`;
                response = await axios.put(url, {}, config);
            }
            else if (name === 'delete') {
                url = `http://localhost:5000/api/posts/post/${id}`;
                response = await axios.delete(url,config);
            }
            if (response.data.errors)
                throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            setErrorMessage('');
            setRefetch(!refetch);
        } catch (err) {
            console.log(err.message);
            setErrorMessage(err.message);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setPostInfo(current => {
            return { ...current, [name]: value };
        })
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (jwt.length === 0) {
            setErrorMessage('Please Login first');
            return;
        }
        try {
            let data = JSON.stringify(postInfo);
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': jwt
                }
            }
            let response = await axios.post('http://localhost:5000/api/posts', data, config);
            if (response.data.errors)
                throw Error(response.data.errors[0].message || response.data.errors[0].msg);
            console.log(response.data);
            setErrorMessage('');
            setRefetch(!refetch);
            setPostInfo({ title: '', description: '' });
        } catch (err) {
            console.log(err.message);
            setErrorMessage(err.message);
        }
    }
    return (<section className="container">
        {errMessage.length !== 0 && <Errors resetError={setErrorMessage}>{errMessage}</Errors>}
        <h1 className="large text-primary">
            Posts
        </h1>
        <p className="lead"><i className="fas fa-user"></i> Welcome to the community!</p>

        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form onSubmit={handleSubmit} className="form my-1">
                <textarea onChange={handleChange} className="title" name="title" placeholder="Enter title of the post" required value={postInfo.title}></textarea>
                <textarea
                    onChange={handleChange}
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    value={postInfo.description}
                    required
                ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>

        <div className="posts">

            {allPosts.length !== 0 && allPosts.map((post, ind) => {
                return (
                    <div key={ind} className="post bg-white p-1 my-1">
                        <div>
                            <a href="profile.html">
                                <img
                                    className="round-img"
                                    src={post.user.avatar}
                                    alt=""
                                />
                                <h4>{post.user.name}</h4>
                            </a>
                        </div>
                        <div>
                            <h1 className="my-1">
                                {post.title}
                            </h1>
                            <p className="my-1">
                                {post.description}
                            </p>
                            <p className="post-date">
                                Posted on {post.date.substring(0, 10)}
                            </p>
                            <button onClick={handleClick} name="like" id={post._id} type="button" className="btn btn-light">
                                {/* button for like/unlike */}
                                <i className="fas fa-thumbs-up">{post.likes.length}</i>
                            </button>
                            <button onClick={handleClick} name="dislike" id={post._id} type="button" className="btn btn-light">
                                {/* button for dislike/undislike */}
                                <i className="fas fa-thumbs-down">{post.dislikes.length}</i>
                            </button>
                            <Link to="/post" className="btn btn-primary">
                                Discussion <span className='comment-count'>{post.comments.length}</span>
                            </Link>
                            <button
                                type="button"
                                className="btn btn-danger"
                                id={post._id}
                                name="delete"
                                onClick={handleClick}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    </section>)
}