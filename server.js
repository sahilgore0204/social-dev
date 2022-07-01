const express=require('express');
//const mongoose=require('mongoose');
const config=require('config');
const connecToAtlas=require('./config/db_connect');
const app=express();

app.use('/api/user',require('./routes/api/user'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/auth',require('./routes/api/auth'));


connecToAtlas();

app.get('/',(req,res)=>res.send("hello world"));

let PORT=process.env.PORT || 5000;
app.listen(5000,()=>{
    console.log(`listening on port ${PORT}`)
})