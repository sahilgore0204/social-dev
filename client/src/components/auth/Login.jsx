import React,{useContext,useState} from 'react'
import Errors from '../Errors'
import AuthContext from '../context/auth-context'
import { Link,Navigate} from 'react-router-dom';
import axios from 'axios';
export default function Login(){
    const auth=useContext(AuthContext);
    //console.log(auth.jwt);
    const [loginInfo,setLoginInfo]=useState({
      email:'',
      password:''
    })
    const [errMessage,setErrMessage]=useState('');
    function handleChange(event){
      const {name,value}=event.target;
      setLoginInfo({...loginInfo,[name]:value});
    }
    async function handleSubmit(event){
      event.preventDefault();
      //console.log(loginInfo);
      let config={
        headers:{
          'Content-Type':'application/json'
        }
      }
      let data=JSON.stringify(loginInfo);
      try {
        let response=await axios.post('http://localhost:5000/api/auth',data,config);
        console.log(response.data);
        if(response.data.errors){
          throw Error(response.data.errors[0].message || response.data.errors[0].msg);
        }
        auth.setJwt(response.data);
      } catch (err) {
        console.log(err.message);
        setErrMessage(err.message);
      }
    }
    return(
       <section className="container">
        {auth.jwt.length!==0 && <Navigate to='/dashboard' />}
        {errMessage.length>0 && <Errors resetError={setErrMessage}>{errMessage}</Errors>}
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <input
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange}
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    )
}