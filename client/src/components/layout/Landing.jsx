import React,{useContext} from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/auth-context';
export default function Landing(){
    const auth=useContext(AuthContext);
    return (
        <section className="landing">
            {auth.jwt.length!==0 && <Navigate to='/dashboard'/>}
            <div className="dark-overlay">
            <div className="landing-inner">
                <h1 className="x-large">Developer Connector</h1>
                <p className="lead">
                Create a developer profile/portfolio, share posts and get help from
                other developers
                </p>
                <div className="buttons">
                <Link to='register' className='btn btn-primary'>Register</Link>
                <Link to='login' className='btn btn-light'>Login</Link>
                </div>
            </div>
            </div>
        </section>
    )
}