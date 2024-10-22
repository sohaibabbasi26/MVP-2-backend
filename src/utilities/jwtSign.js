const JWT = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

async function jwtSignature(data){
    const verificationToken = JWT.sign(data, process.env.JWT_SECRET, {
        expiresIn: "10h",
    });
    return verificationToken;
}

module.exports = {
    jwtSignature
}