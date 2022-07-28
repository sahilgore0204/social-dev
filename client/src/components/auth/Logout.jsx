import React,{useContext} from "react";
import AuthContext from "../context/auth-context";
import Protect from './Protect'
export default function Logout(){
    const auth=useContext(AuthContext);
    auth.setJwt('');
    return <Protect jwt={auth.jwt} />
}