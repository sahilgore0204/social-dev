import React,{Fragment,useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
export default function Register(){
    const [registerInfo,setRegisterInfo]=useState({
        name:'',
        email:'',
        password:'',
        password2:'',
    });
    function handleChange(event){
        const {name,value}=event.target;
        //console.log(name,value);
        setRegisterInfo(currentState=>{
            return {...currentState,[name]:value}
        })
    }
    async function handleSubmit(event){
        event.preventDefault();
        const {name,email,password,password2}=registerInfo;
        if(password!==password2){
            console.log('password not equal');
            setRegisterInfo({...registerInfo,password:'',password2:''});
        }
        else{
            console.log(registerInfo);
            let newUser={
                name,
                email,
                password
            }
            let config={
                headers:{
                    'Content-Type':'application/json'
                }
            }
            let data=JSON.stringify(newUser);
            try {
                let response=await axios.post('http://localhost:5000/api/user',data,config);
                console.log(response.data);
            } catch (err) {
                console.log(err.message);
            }
        }
    }
    return (
    <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
            <input onChange={handleChange} type="text" placeholder="Name" name="name" required value={registerInfo.name} />
            </div>
            <div className="form-group">
                <input onChange={handleChange} type="email" placeholder="Email Address" name="email" value={registerInfo.email} />
                <small className="form-text">
                    This site uses Gravatar so if you want a profile image, use a
                    Gravatar email
                </small>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={registerInfo.password}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    minLength="6"
                    value={registerInfo.password2}
                />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
        </p>
    </section>
    )
}