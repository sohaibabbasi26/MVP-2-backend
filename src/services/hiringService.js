const HiringPayment = require("../models/hiring_payment");

const createHiringService= async(req)=>{
    const body= req?.body;
    try{
        await HiringPayment.create({
            ...body
        });
        return {
            status: 200,
            message: "hiring created successfully"
        }
    }catch(e){
        return {
            status: 500,
            message: e.message
        }
    }
}

module.exports= {
    createHiringService
}