import React, { Fragment } from 'react';

export default function Navbar(){
    return (<Fragment>
    <nav className="navbar bg-dark">
        <h1>
            <a href="index.html"><i className="fas fa-code"></i> Social Dev</a>
        </h1>
        <ul>
            <li><a href="profiles.html">Developers</a></li>
            <li><a href="register.html">Register</a></li>
            <li><a href="login.html">Login</a></li>
        </ul>
    </nav>
    </Fragment>);
}