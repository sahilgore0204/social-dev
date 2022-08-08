import React,{useContext} from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import Protect from './Protect'
export default function Logout(){
    const auth=useContext(AuthContext);
    window.localStorage.removeItem('jwt');
    document.cookie = "github_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    auth.setJwt('');
    return <Navigate to='/'></Navigate>
}