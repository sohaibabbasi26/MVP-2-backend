const { createHiringService } = require("../services/hiringService")

const createHiringHandler= async(req,res)=>{
    try{
        const result= await createHiringService(req);
        res.status(result.status)
        .send({...result})
    }catch(e){
        res.status(500)
        .send({
            status: 500,
            message: e.message
        })
    }
}

module.exports={
    createHiringHandler
}