
async function serverCheck(req,res) {
    try{
        res.send("SERVER IS RUNNING!")
    }
    catch(err){
        console.log("ERROR:",err);
        return;
    }
}

module.exports = {
    serverCheck
}