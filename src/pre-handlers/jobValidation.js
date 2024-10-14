const Joi = require("joi");

const getHiredCandidatesSchema= Joi.object({
    job_posting_id: Joi.string().optional(),
    client_id: Joi.string().optional(),
    candidate_id: Joi.string().optional(),
    job_status: Joi.string().allow('hired','trial','qualified','not-qualified','hired-and-trial','all').required(),
})

const getHiredCandidatesValidation= (req,res,next)=>{
    const {err}= getHiredCandidatesSchema.validate(req?.query);
    if(err){
        res.status(400).send({
            message: err.message
        })
    }
    next();
}

module.exports={
    getHiredCandidatesValidation
}