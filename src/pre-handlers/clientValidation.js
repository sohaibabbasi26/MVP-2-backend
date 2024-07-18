const Joi = require("joi");

const client_request_schema= Joi.object({
    expertise: Joi.array().required(),
    experience: Joi.string().required(),
    client_id: Joi.string().required(),
})

const validateClientRequest= (req,res,next)=>{
    const {error}= client_request_schema.validate(req.body);
    if(error){
        res.status(400).send({
            message:error
        })
    }else{
        next();
    }
}

module.exports={
    validateClientRequest
}