var jwt = require('jsonwebtoken');

var privateKey = process.env.CLOUD_API_JWT_KEY;

async function getToken(name,userId){
    var token = await jwt.sign({ name: name, id: userId }, privateKey);
    return token;
}

async function validateToken(token){
    try {
        var tokenUser = await jwt.verify(token, privateKey);
        return tokenUser;
    }
    catch(err){ }
}

module.exports = {getToken, validateToken};
