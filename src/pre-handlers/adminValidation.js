const Joi = require("joi");
//schedule interview
const interviewScheduleschema = Joi.object({
  customer_id: Joi.string().min(2).max(50).required(),
  //customer_email: Joi.string().email().required(),
  interview_time: Joi.string().required(),
  interview_date: Joi.date().required(),
  job_posting_id: Joi.string().required(),
});

//Admin will assign customer to client
const assigningCustomerSchema = Joi.object({
  customer_id: Joi.string().min(2).max(50).required(),
  client_id: Joi.string().min(2).max(50).required(),
  job_posting_id: Joi.string().min(2).max(50).required(),
  hourly_rate: Joi.number().greater(0)
});

const validate_assigningCustomerSchema = (req, res, next) => {
  const { error } = assigningCustomerSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  next();
};
//validator interview schedule
const validate_InterviewScheduleSchema = (req, res, next) => {
  const { error } = interviewScheduleschema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    });
  } else {
    next();
  }
};

module.exports = {
  validate_InterviewScheduleSchema,
  validate_assigningCustomerSchema,
};
