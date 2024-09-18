const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    method: Joi.string().min(2).required(),
    user_role:Joi.string().min(2).required(),
})

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    //contact_no: Joi.string().min(11).max(50),
    method: Joi.string().min(2).required(),
    user_role:Joi.string().min(2).required(),
    //client_location: Joi.string().min(2)
});

const jobPostSchema = Joi.object({
    position: Joi.string().min(2).max(50).required(),
    client_id: Joi.string().min(2).max(50).required(),
    skills: Joi.array().required(),
    experience: Joi.string().required(),
    job_type: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(2).max(1000).required(),
    status: Joi.string().min(2).max(50).required(),
    applied_customers_count: Joi.number().required(),
    location: Joi.string().min(2).max(50).required(),
    is_test_required: Joi.boolean().required(),
    application_questions: Joi.array().optional(),
    project_length: Joi.string().required(),
    start_date: Joi.string().required(),
    workday_overlap: Joi.string().required()
})

const genRandQuesSchema = Joi.object({
    limit: Joi.number().required(),
    expertise: Joi.array().required(),
})

const genCodingquestionSchema = Joi.object({
    job_posting_id: Joi.string().min(8).max(50).required(),
    customer_id: Joi.string().min(8).max(50),
});

const takeTestSchema = Joi.object({
    question_answer: Joi.array().required(),
    customer_id: Joi.string().min(8).max(50),
    job_posting_id: Joi.string().min(8).max(50)
})

const emailSendSchema= Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().required(),
    text: Joi.string().required()
})

const validateRegister = (request, reply, done) => {
    try {
        const { error } = registerSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    }catch(e){
        console.log("ERR:",e)
    }
};



const validateTakeTestBody = (request,reply,done) => {
    try {
        const { error } = takeTestSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    } catch(e){
        console.log("ERR:",e)
    }
}

const validateCodingGenBody = (request,reply,done) => {
    try {
        const { error } = genCodingquestionSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    } catch(e){
        console.log("ERR:",e)
    }
}

const validateJobPost = (request, reply, done) => {
    try {
        const { error } = jobPostSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    }catch(e){
        console.log("ERR:",e)
    }
};

const validateRandomQuestionGen = (request, reply, done) => {
    try {
        const { error } = genRandQuesSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    }catch(e){
        console.log("ERR:",e)
    }
};

const validateLogin = (request, reply, done) => {
    try {
        const { error } = loginSchema.validate(request.body);
        if (error) {
            return reply.status(400).send(error.details[0].message);
        }
        done();
    }catch(e){
        console.log("ERR:",e)
    }
};

const validateSendEmail= (req,res,done)=>{
    try {
        const { error } = emailSendSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details);
        }
        done();
    }catch(e){
        console.log("ERR:",e)
    }
}

module.exports = {
    validateRegister,
    validateLogin,
    validateRandomQuestionGen,
    validateJobPost,
    validateTakeTestBody,
    validateCodingGenBody,
    validateSendEmail
}