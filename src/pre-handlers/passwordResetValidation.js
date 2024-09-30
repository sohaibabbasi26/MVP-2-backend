const Joi = require("joi");

const passwordResetValidationSchema= Joi.object({
    email: Joi.string().email().required(),
    user_role: Joi.string().required(),
    //current_password: Joi.string().required(),
    new_password: Joi.string().min(8).required()
});

const validatePasswordReset= (request, response, next)=>{
    const {error}= passwordResetValidationSchema.validate(request.body);
    if(error){
        response.status(400).send({     
            message: error["message"]
        })
    }else{
        next();
    }
    
}

module.exports={
    validatePasswordReset
}