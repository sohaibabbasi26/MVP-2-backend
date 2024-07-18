const primaryHandlers = require("../handlers/primaryHandlers");
const clientHandlers = require("../handlers/clientHandler");
const customerHandlers = require("../handlers/customerHandler");
const authValidation = require("../pre-handlers/authValidation");
const customerHandler = require("../handlers/customerHandler");
const adminHandler = require("../handlers/adminHandler");
const clientValidation = require("../pre-handlers/clientValidation");
const customerValidation = require("../pre-handlers/customerValidation");
const adminValidation = require("../pre-handlers/adminValidation");

const routes = [
  {
    method: "GET",
    url: "/",
    handler: primaryHandlers.serverCheck,
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
    url: "/assigned_customer/:client_id",
    handler: clientHandlers.getcustomerwithclientid,
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
    method: "POST",
    url: "/get-customer-with-expertise",
    handler: customerHandler.getCustomerWithExpertise,
    prehander: customerValidation.validateExpertise,
  },
  {
    method: "POST",
    url: "/scheduling-interview",
    handler: adminHandler.admininterview,
    prehandler: adminValidation.validate_registerSchema,
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
    handler: adminHandler.adminassignedhandler,
    prehander: adminValidation.validate_adminassignedSchema,
  },
  {
    method: "PUT",
    url: "/client-profile-update/:client_id",
    handler: clientHandlers.client_updateprofile,
    preHandler: clientValidation.validateClientProfileUpdate,
  },
];

module.exports = { routes };
