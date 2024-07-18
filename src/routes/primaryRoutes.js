const primaryHandlers = require("../handlers/primaryHandlers");
const clientHandlers = require("../handlers/clientHandler");
const customerHandlers = require("../handlers/customerHandler");
const authValidation = require("../pre-handlers/authValidation");
const { getCustomerWithExpertise } = require("../handlers/customerHandler");
const { admininterview } = require("../handlers/admin-interview-Handler");
const { adminassignedhandler } = require("../handlers/adminassignedhandler");
const {
  validateClientProfileUpdate,
} = require("../pre-handlers/clientValidation");
const { validateExpertise } = require("../pre-handlers/customerValidation");
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
    method: "POST",
    url: "/get-customer-with-expertise",
    handler: getCustomerWithExpertise,
    prehander: validateExpertise,
  },
  {
    method: "POST",
    url: "/scheduling-interview",
    handler: admininterview,
  },
  {
    method: "POST",
    url: "/gen-random-questions",
    handler: primaryHandlers.getRandomQuestions,
    preHandler: authValidation.validateRandomQuestionGen,
  },
  {
    method: "POST",
    url: "/create-positions",
    handler: primaryHandlers.createPositions,
    preHandler: authValidation.validateJobPost,
  },
  {
    method: "POST",
    url: "/send-email",
    handler: primaryHandlers.sendMail,
  },
  {
    method: "POST",
    url: "/assigned_customer",
    handler: adminassignedhandler,
  },
  {
    method: "GET",
    url: "/assigned_customer/:client_id",
    handler: clientHandlers.getcustomerwithclientid,
  },
  {
    method: "PUT",
    url: "/client-profile-update/:client_id",
    handler: clientHandlers.client_updateprofile,
    preHandler: validateClientProfileUpdate,
  },
];

module.exports = { routes };
