const Joi = require("joi");

const get_customer_expertise_schema = Joi.object({
  expertise: Joi.array().required(),
});

const set_customer_stripe_account_schema = Joi.object({
  customer_id: Joi.string().required(),
  stripe_id: Joi.string().required(),
});

const get_customer_stripe_account_schema = Joi.object({
  customer_id: Joi.string().required(),
});


const validateExpertise = (req, res, next) => {
  const { error } = get_customer_expertise_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error,
    });
  } else {
    next();
  }
};

const validateSetCustomerStripeAccount = (req, res, next) => {
  const { error } = set_customer_stripe_account_schema.validate(req.body);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

const validateGetCustomerStripeAccount = (req, res, next) => {
  const { error } = get_customer_stripe_account_schema.validate(req.query);
  if (error) {
    res.status(400).send({
      message: error["message"],
    });
  } else {
    next();
  }
};

module.exports = {
  validateExpertise,
  validateGetCustomerStripeAccount,
  validateSetCustomerStripeAccount,
};
