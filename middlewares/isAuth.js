const jwt = require('jsonwebtoken');

//to get userId from token 
module.exports = (req, res, next) => {
    //throw error when token is not send!
    if(req.get('Authorization')==undefined){
        const error = new Error('Not token send!');
        error.statusCode = 401;
        throw error;
    }
    const token = req.get('Authorization').split(' ')[1];

    try{
        decodedToken = jwt.verify(token,process.env.PRIVATEKEY);
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Autheticated!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}