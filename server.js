const express=require('express');
//const mongoose=require('mongoose');
const connecToAtlas=require('./db_connect');
const app=express();

//very important piece of code to disable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth-token");
    res.header("Access-Control-Allow-Methods","*")
    next();
  });

app.use(express.json({extended:false}));

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