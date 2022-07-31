import React, { useContext, useEffect, useState } from "react";
import Errors from "../Errors";
import AuthContext from '../context/auth-context'
import axios from "axios";
export default function Posts() {
    let jwt = useContext(AuthContext).jwt;
    const [postInfo, setPostInfo] = useState({ title: '', description: '' });
    const [errMessage, setErrorMessage] = useState('');
    const [allPosts, setAllPosts] = useState([]);
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
    }, []);


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
                            <p className="my-1">
                                {post.title}
                            </p>
                            <p className="my-1">
                                {post.description}
                            </p>
                            <p className="post-date">
                                Posted on {post.date.substring(0,10)}
                            </p>
                            <button type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-up"></i>
                                <span>{post.likes.length}</span>
                            </button>
                            <button type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-down">{post.dislikes.length}</i>
                            </button>
                            <a href="post.html" className="btn btn-primary">
                                Discussion <span className='comment-count'>{post.comments.length}</span>
                            </a>
                            <button
                                type="button"
                                className="btn btn-danger"
                                id={post._id}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                )
            })}

            {/* <div className="post bg-white p-1 my-1">
                <div>
                    <a href="profile.html">
                        <img
                            className="round-img"
                            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                            alt=""
                        />
                        <h4>John Doe</h4>
                    </a>
                </div>
                <div>
                    <p className="my-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                        possimus corporis sunt necessitatibus! Minus nesciunt soluta
                        suscipit nobis. Amet accusamus distinctio cupiditate blanditiis
                        dolor? Illo perferendis eveniet cum cupiditate aliquam?
                    </p>
                    <p className="post-date">
                        Posted on 04/16/2019
                    </p>
                    <button type="button" className="btn btn-light">
                        <i className="fas fa-thumbs-up"></i>
                        <span>4</span>
                    </button>
                    <button type="button" className="btn btn-light">
                        <i className="fas fa-thumbs-down"></i>
                    </button>
                    <a href="post.html" className="btn btn-primary">
                        Discussion <span className='comment-count'>3</span>
                    </a>
                    <button
                        type="button"
                        className="btn btn-danger"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div> */}
        </div>
    </section >)
}