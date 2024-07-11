
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
        res.send(data);
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