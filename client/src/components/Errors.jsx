import React from 'react'

export default function Errors(props){
    return <div className="alert alert-danger">
    {props.children}
    <button onClick={()=>{
        props.resetError('');
    }} className='msg-btn'>x</button>
  </div>
}