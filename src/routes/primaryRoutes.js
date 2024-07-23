const primaryHandlers = require("../handlers/primaryHandlers");
const clientHandlers = require("../handlers/clientHandler");
const customerHandlers = require("../handlers/customerHandler");
const resetPasswordHandler = require("../handlers/passwordResetHandler");
const authValidation = require("../pre-handlers/authValidation");
const customerHandler = require("../handlers/customerHandler");
const adminHandler = require("../handlers/adminHandler");
const clientValidation = require("../pre-handlers/clientValidation");
const customerValidation = require("../pre-handlers/customerValidation");
const adminValidation = require("../pre-handlers/adminValidation");
const resetPasswordValidation = require("../pre-handlers/passwordResetValidation");

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
    handler: adminHandler.getcustomerwithclientid,
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
    handler: adminHandler.scheduleinterviewhandler,
    prehandler: adminValidation.validate_InterviewScheduleSchema,
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
    handler: adminHandler.assigningCustomerHandler,
    prehander: adminValidation.validate_assigningCustomerSchema,
  },
  {
    method: "PUT",
    url: "/client-profile-update/:client_id",
    handler: clientHandlers.client_updateprofile,
    preHandler: clientValidation.validateClientProfileUpdate,
  },
  {
    method: "POST",
    url: "/password-reset",
    handler: resetPasswordHandler.resetPasswordHandler,
    preHandler: resetPasswordValidation.validatePasswordReset,
  },
  {
    method: "POST",
    url: "/admin/approve-customer",
    handler: adminHandler.approveCustomerHandler,
  },
  {
    method: "POST",
    url: "/client/create-request",
    handler: clientHandlers.createClientRequestHandler,
    preHandler: clientValidation.validateClientRequest,
  },
  {
    method: "GET",
    url: "/admin/fetch-client-requests",
    handler: adminHandler.fetchClientRequestHandler,
  },
  {
    method: "POST",
    url: "/client/client-response",
    preHandler: clientValidation.validateClientResponse, //accept Pending Reject
    handler: clientHandlers.clientResponseHandler,
  },
  {
    method: "POST",
    url: "/client/client_interview",
    handler: clientHandlers.clientinterviewhandler,
  },
];

module.exports = { routes };
