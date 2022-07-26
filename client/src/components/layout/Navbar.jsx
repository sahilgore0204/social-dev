import React, { useContext,Fragment } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/auth-context';
export default function Navbar() {
    const auth=useContext(AuthContext);
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to='/'><i className="fas fa-code"></i> Social Dev</Link>
            </h1>
            <ul>
                <li><Link to="/profiles">Developers</Link></li>
                {auth.jwt.length!==0?<Fragment><li><Link to="/posts">Posts</Link></li>
                <li><Link to="/logout">Logout</Link></li></Fragment>:<Fragment>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                </Fragment>}
            </ul>
        </nav>);
}