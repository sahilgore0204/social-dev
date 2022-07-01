const mongoose=require('mongoose');
const config=require('config');

let connectToAtlas=async ()=>{
    try{
        await mongoose.connect(config.get('mongoURI'));
        console.log("connected to atlas..");
    }
    catch(err){
        console.log(`connecting to atlas failed: ${err.message}`);
    }
}
module.exports=connectToAtlas;