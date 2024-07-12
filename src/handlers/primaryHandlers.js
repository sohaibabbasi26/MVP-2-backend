const services = require('../services/primaryServices');

async function serverCheck(req,res) {
    try{
        res.send("SERVER IS RUNNING!")
    }
    catch(err){
        console.log("ERROR:",err);
        return;
    }
}

async function signup(req,res){
    try{
        const data = req?.body;
        console.log("data:",data);
        const result = await services.signup(data) ;
        res.send(result);
    }
    catch(err){
        console.log("ERROR:",err);
        return;
    }
}

module.exports = {
    serverCheck,
    signup
}