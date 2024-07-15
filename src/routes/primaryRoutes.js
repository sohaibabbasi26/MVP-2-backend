const primaryHandlers = require("../handlers/primaryHandlers");
const clientHandlers = require("../handlers/clientHandler");
const customerHandlers = require("../handlers/customerHandler");
const authValidation = require("../pre-handlers/authValidation");
const { getCustomerWithExpertise } = require("../handlers/customerHandler");
const routes = [
  {
    method: "GET",
    url: "/",
    handler: primaryHandlers.serverCheck,
  },
  {
    method: "POST",
    url: "/signup",
    handler: primaryHandlers.signup,
    preHandler: authValidation.validateRegister,
  },
  {
    method: "POST",
    url: "/login",
    handler: primaryHandlers.login,
    preHandler: authValidation.validateLogin,
  },
  {
    method: "GET",
    url: "/customers",
    handler: customerHandlers.customers,
  },
  {
    method: "GET",
    url: "/clients",
    handler: clientHandlers.clients,
  },
  {
    method: "GET",
    url: "/get-customer-with-expertise",
    handler: getCustomerWithExpertise,
  },
];

module.exports = { routes };
