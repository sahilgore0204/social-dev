const mongoose=require('mongoose');
require('dotenv').config();

let connectToAtlas=async ()=>{
    try{
        await mongoose.connect(process.env.mongoURI);
        console.log("connected to atlas..");
    }
    catch(err){
        console.log(`connecting to atlas failed: ${err.message}`);
    }
}
module.exports=connectToAtlas;