const Joi = require("joi");

const client_request_schema = Joi.object({
    expertise: Joi.array()
        .required()
        .messages({
            'any.required': 'Expertise is required.',
            'array.base': 'Expertise must be an array.'
        }),
    experience: Joi.string()
        .required()
        .valid('beginner','expert','intermediate')
        .messages({
            'any.required': 'Experience is required.',
            'string.base': 'Experience must be a string.'
        }),
    client_id: Joi.string()
        .required()
        .messages({
            'any.required': 'Client ID is required.',
            'string.base': 'Client ID must be a string.',
            //'any.only': 'Client ID must be one of the following values: less than 1 year, 1 year, 2 years, more than 2 years.'
        }),
});

const validateClientRequest= (req,res,next)=>{
    const {error}= client_request_schema.validate(req.body);
    if(error){  
        res.status(400).send({     
            message: error["message"]
        })
    }else{
        next();
    }
}

module.exports={
    validateClientRequest
}