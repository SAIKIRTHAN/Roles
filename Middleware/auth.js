var jwt = require('jsonwebtoken');

exports.authenticate = async(req,res,next)=>{
    try{
        if (req.headers['x-access-token']) {
            let decoded = jwt.verify(req.headers['x-access-token'], 'your_secret_key_here');
            if (decoded) {
                req.headers['x-user-id'] = decoded.userId;
                req.headers['x-user-emailId'] = decoded.emailId;
                next();
            }
        }
    }catch(error){
        return res.status(500).send({error:true,message:error.message})
    }
}

