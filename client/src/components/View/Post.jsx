import React, { Fragment, useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Errors from '../Errors';
import AuthContext from '../context/auth-context';
export default function Post(props) {
    const { post_id } = useParams();
    //console.log(post_id);
    const jwt = useContext(AuthContext).jwt;
    const [fetch, refetch] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [post, setPost] = useState();
    const [comment, setComment] = useState('');
    const [userId, setUserId] = useState('');//get user_id through jwt (it verifies jwt,and sends the user id)

    useEffect(() => {
        const fetchPost = async () => {
            const url = `http://localhost:5000/api/posts/post/${post_id}`;
            try {
                const response = await axios.get(url);
                if (response.data.errors)
                    throw Error(response.data.errors[0].message || response.data.errors[0].msg);
                setPost(response.data);
                setErrMessage('');
            } catch (err) {
                console.log(err.message);
                setErrMessage(err.message);
            }
        }
        fetchPost();
    }, [fetch]);
    //console.log(post);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = 'http://localhost:5000/api/auth'
                const response = await axios.get(url, { headers: { 'x-auth-token': jwt } })
                if (response.data.errors)
                    throw Error(response.data.errors[0].message || response.data.errors[0].msg)
                setUserId(response.data);
                //console.log(response.data);
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchUser();
    }, []);
    function handleChange(event) {
        const value = event.target.value;
        setComment(value);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        //make a request to add the comment to post with given id;
        if (jwt.length === 0) {
            setErrMessage('Please Login first');
            return;
        }
        const url = `http://localhost:5000/api/posts/comment/${post_id}`
        const data = JSON.stringify({
            description: comment
        })
        const config = {
            headers: {
                'x-auth-token': jwt,
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await axios.put(url, data, config);
            if (response.data.errors)
                throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            setErrMessage('');
            refetch(!fetch);
        } catch (err) {
            console.log(err.message);
            setErrMessage(err.message);
        }
    }
    //console.log(userId);
    async function handleClick(event){
        const id=event.target.name;
        //console.log(id);
        //delete comment by id
        const url=`http://localhost:5000/api/posts/comment/${id}`
        const config={
            headers:{
                'x-auth-token':jwt
            }
        }
        try {
            const response=await axios.delete(url,config);
            if(response.data.errors)
            throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            setErrMessage('');
            refetch(!fetch);
        } catch (err) {
            console.log(err.message);
            setErrMessage(err.message);
        }
    }
    return (
        <section className="container">
            {errMessage.length !== 0 && <Errors resetError={setErrMessage}>{errMessage}</Errors>}
            {post && <Fragment>
                <Link to="/posts" className="btn">Back To Posts</Link>
                <div className="post bg-white p-1 my-1">
                    <div>
                        <Link to="/profile">
                            <img
                                className="round-img"
                                src={post.user.avatar}
                                alt=""
                            />
                            <h4>{post.user.name}</h4>
                        </Link>
                    </div>
                    <div>
                        <h1 className="my-1">
                            {post.title}
                        </h1>
                        <p className="my-1">
                            {post.description}
                        </p>
                    </div>
                </div>

                <div className="post-form">
                    <div className="bg-primary p">
                        <h3>Leave A Comment</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="form my-1">
                        <textarea
                            onChange={handleChange}
                            name="description"
                            cols="30"
                            rows="5"
                            placeholder="Comment on this post"
                            required
                            value={comment}
                        ></textarea>
                        <input type="submit" className="btn btn-dark my-1" value="Submit" />
                    </form>
                </div>

                <div className="comments">

                    {post.comments.map((comment, ind) => {
                        return (
                            <div key={ind} className="post bg-white p-1 my-1">
                                <div>
                                    <Link to="/profile">
                                        <img
                                            className="round-img"
                                            src={comment.user.avatar}
                                            alt=""
                                        />
                                        <h4>{comment.user.name}</h4>
                                    </Link>
                                </div>
                                <div>
                                    <p className="my-1">
                                        {comment.description}
                                    </p>
                                    <p className="post-date">
                                        Posted on {comment.date.substring(0, 10)};
                                    </p>
                                </div>
                                {userId === comment.user._id && <button
                                    name={comment._id}
                                    onClick={handleClick}
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    <i className="fas fa-times"></i>
                                </button>}
                            </div>
                        )
                    })}
                </div>
            </Fragment>}
        </section>
    )
}