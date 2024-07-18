const Joi = require("joi");
//schedule interview
const registerSchema = Joi.object({
  customer_id: Joi.string().min(2).max(50).required(),
  customer_email: Joi.string().email().required(),
  interview_time: Joi.string().required(),
  interview_date: Joi.date().required(),
});

//Admin will assign customer to client
const adminassignedSchema = Joi.object({
  customer_id: Joi.string().min(2).max(50).required(),
  client_id: Joi.string().min(2).max(50).required(),
  job_posting_id: Joi.string().min(2).max(50).required(),
});

const validate_adminassignedSchema = (req, res, next) => {
  const { error } = adminassignedSchema.validate(req.body);
  try {
    if (error) {
      res.status(400).send({
        message: error,
      });
    } else {
      next();
    }
  } catch (e) {
    console.log(`Error while processing your request: ${e}`);
  }
};
const validate_registerSchema = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error,
    });
  } else {
    next();
  }
};

module.exports = { validate_registerSchema, validate_adminassignedSchema };
