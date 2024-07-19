const Joi = require("joi");

const client_profile_update_schema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  contact_no: Joi.string().min(11).max(50),
  status: Joi.string().valid("Active", "In-Active"),
  client_location: Joi.string(),
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
module.exports = { validateClientProfileUpdate };
