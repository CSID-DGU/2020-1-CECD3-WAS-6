const jwt = require('jsonwebtoken');

async function authorizationAPI(req, res, next){
    var authToken= req.header('authorization');
    if(!authToken) 
        return res.json({
            isAuth: false,
            error: true
        });
    
    if(authToken.startsWith('Bearer ')){
        authToken = authToken.substring(7, authToken.length);
    }else{
        res.status(401).send('Access Denied')
    }
    try{
        const verified = jwt.verify(authToken, process.env.TOKEN);
        req.user = verified;
        next(); 
    }catch(e){
        console.log(e);
        res.status(401).send('Invalid token');
    }

}

module.exports = { authorizationAPI };