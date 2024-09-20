const Joi = require("joi");

const client_profile_update_schema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  contact_no: Joi.string().min(11).max(50),
  status: Joi.string().valid("Active", "In-Active"),
  client_location: Joi.string(),
});

const client_response_schema = Joi.object({
  client_id: Joi.string().required().messages({
    "any.required": "client id is required",
    "string.base": "client id must be a string.",
  }),
  customer_id: Joi.string().required().messages({
    "any.required": "customer id is required",
    "string.base": "customer id must be a string.",
  }),
  job_posting_id: Joi.string().required().messages({
    "any.required": "job posting id is required",
    "string.base": "job posting must be a string.",
  }),
  response_status: Joi.string()
    .required()
    .valid("accept", "decline", "pending")
    .messages({
      "any.required": "Response status is required.",
      "string.base": "response status must be a string.",
      "any.only":
        "response status must be any one of the following: accept, decline, or pending",
    }),
});

const validateClientProfileUpdate = (req, res, next) => {
  const { error } = client_profile_update_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error,
    });
  } else {
    next();
  }
};

const client_request_schema = Joi.object({
  expertise: Joi.array().required().messages({
    "any.required": "Expertise is required.",
    "array.base": "Expertise must be an array.",
  }),
  experience: Joi.string()
    .required()
    .valid("beginner", "expert", "intermediate")
    .messages({
      "any.required": "Experience is required.",
      "string.base": "Experience must be a string.",
    }),
  client_id: Joi.string().required().messages({
    "any.required": "Client ID is required.",
    "string.base": "Client ID must be a string.",
    //'any.only': 'Client ID must be one of the following values: less than 1 year, 1 year, 2 years, more than 2 years.'
  }),
});

const set_client_stripe_account_schema= Joi.object({
  client_id: Joi.string().required(),
  stripe_id: Joi.string().required()
})

const get_client_stripe_account_schema= Joi.object({
  client_id: Joi.string().required(),
})

const validateClientRequest = (req, res, next) => {
  const { error } = client_request_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

const validateClientResponse = (req, res, next) => {
  const { error } = client_response_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

const validateSetClientStripeAccount= (req, res, next) => {
  const { error } = set_client_stripe_account_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

const validateGetClientStripeAccount= (req, res, next) => {
  const { error } = get_client_stripe_account_schema.validate(req.query);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

module.exports = {
  validateClientRequest,
  validateClientProfileUpdate,
  validateClientResponse,
  validateSetClientStripeAccount,
  validateGetClientStripeAccount
};
