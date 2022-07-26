import React from 'react'
import { Navigate } from 'react-router-dom';
export default function Protect(props){
    let jwt=props.jwt;
    if(jwt.length===0){
        return <Navigate to='/login' />
    }
}