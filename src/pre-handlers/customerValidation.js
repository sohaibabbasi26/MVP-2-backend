const Joi = require("joi");

const get_customer_expertise_schema = Joi.object({
  expertise: Joi.array().required(),
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
module.exports = { validateExpertise };
