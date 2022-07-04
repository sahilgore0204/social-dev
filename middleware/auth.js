//middleware to verify jwt's and store the jwt info in req, so that there is no need to verify in subsequent requests
const jwt=require('jsonwebtoken');
const config=require('config');
function authMiddleware(req,res,next){
    try{
        let id_token=req.headers['x-auth-token'];
        let payload=jwt.verify(id_token,config.get('jwtSecret'));
        req.user=payload;
        //console.log(payload);
        next();
    }
    catch(err){
        console.log(err.message);
        res.status(401).json({"errors":[{
            "message":err.message
        }]})
    }
}

module.exports=authMiddleware;