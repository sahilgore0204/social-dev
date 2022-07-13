const mongoose=require('mongoose');
const schema=mongoose.Schema;

const postSchema=new schema({
    user:{
        type:schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    likes:[schema.Types.ObjectId],
    dislikes:[schema.Types.ObjectId],
    comments:[
        {
            description:{
                type:String,
                required:true
            },
            user:{
                type:schema.Types.ObjectId,
                ref:'user'
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ]
})

module.exports=mongoose.model('Post',postSchema);