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
    url: "/assigned-customer/:client_id",
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
    url: "/assigned-customer",
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
    url: "/client/client-interview",
    handler: clientHandlers.clientinterviewhandler,
  },
  {
    method: "POST",
    url: "/take-test",
    handler: primaryHandlers.takeTest,
    preHandler: authValidation.validateTakeTestBody,
  },
  {
    method: "POST",
    url: "/gen-coding-ques",
    handler: primaryHandlers.getCodingQuestion,
    preHandler: authValidation.validateCodingGenBody,
  },
  {
    method: "POST",
    url: "/get-coding-verified",
    handler: primaryHandlers.getCodingVerified,
    preHandler: authValidation.validateCodingVerified,
  },
  {
    method: "GET",
    url: "/get-customer-result",
    handler: primaryHandlers.getCustomerResult,
  },
  {
    method: "PUT",
    url: "/set-hourly-rate",
    handler: primaryHandlers.setHourlyRate,
  },
  {
    method: "PUT",
    url: "/set-expertise",
    handler: primaryHandlers.setExpertise,
  },

  {
    method: "PUT",
    url: "/profile-info-update",
    handler: primaryHandlers.profileInfoUpdate,
  },
  {
    method: "PUT",
    url: "/customer/update-expertise",
    handler: customerHandler.updateExpertise,
  },
  {
    method: "GET",
    url: "/client/job-posting/:client_id",
    handler: clientHandlers.getJobviaclientIdHandler,
  },
  {
    method: "GET",
    url: "/tests/customer/:customer_id",
    handler: customerHandler.CustomergettestsHandler,
  },
  {
    method: "GET",
    url: "/coding-results/customer/:customer_id",
    handler: customerHandler.GetcodingresultHandler,
  },
  {
    method: "POST",
    url: "/admin/register-client",
    handler: adminHandler.registerClientHandler,
  },
];

module.exports = { routes };
