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
const jobValidation= require('../pre-handlers/jobValidation')
const jobHandler = require("../handlers/jobHandler");
const testHandler = require("../handlers/testHandler");

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
    // preHandler: primaryHandlers.checkRole("admin", "client"),
  },
  {
    method: "GET",
    url: "/clients",
    handler: clientHandlers.clients,
    // preHandler: primaryHandlers.checkRole("admin", "client"),
  },
  {
    method: "GET",
    url: "/assigned-customer/:client_id",
    handler: adminHandler.getcustomerwithclientid,
    //preHandler: primaryHandlers.checkRole("admin", "client", "customer"),
  },
  {
    method: "POST",
    url: "/signup",
    handler: primaryHandlers.signup,
    preHandler: authValidation.validateRegister,
  },
  {
    method: "POST",
    url: "/signup-google",
    handler: primaryHandlers.signupGoogle,
    preHandler: authValidation.validateGoogleRegister,
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
    url: "/schedule-interview",
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
    preHandler: [
      // primaryHandlers.checkRole("client", "admin"),
      authValidation.validateJobPost, // Validate the job post data
    ],
  },
  {
    method: "POST",
    url: "/send-email",
    handler: primaryHandlers.sendMail,
    preHandler: authValidation.validateSendEmail,
  },
  {
    method: "POST",
    url: "/assigned-customer",
    handler: adminHandler.assigningCustomerHandler,
    preHandler: [
      // primaryHandlers.checkRole("admin"),
      adminValidation.validate_assigningCustomerSchema,
    ],
  },

  {
    method: "PUT",
    url: "/client-profile-update/:client_id",
    handler: clientHandlers.client_updateprofile,
    //preHandler: clientValidation.validateClientProfileUpdate,
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
    // preHandler: primaryHandlers.checkRole("admin"),
  },
  {
    method: "POST",
    url: "/client/create-request",
    handler: clientHandlers.createClientRequestHandler,
    preHandler: clientValidation.validateClientRequest,
    // preHandler: primaryHandlers.checkRole("client"),
  },
  {
    method: "GET",
    url: "/admin/fetch-client-requests",
    handler: adminHandler.fetchClientRequestHandler,
    // preHandler: primaryHandlers.checkRole("admin"),
  },
  {
    method: "POST",
    url: "/client/client-response",
    preHandler: clientValidation.validateClientResponse, //accept Pending Reject
    handler: clientHandlers.clientResponseHandler,
    // preHandler: primaryHandlers.checkRole("client"),
  },
  {
    method: "POST",
    url: "/client/client-interview",
    handler: clientHandlers.clientinterviewhandler,
  },
  // {
  //   method: "POST",
  //   url: "/take-test",
  //   handler: primaryHandlers.takeTest,
  //   preHandler: authValidation.validateTakeTestBody,
  // },
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
    // preHandler: primaryHandlers.checkRole("customer"),
  },
  {
    method: "PUT",
    url: "/set-expertise",
    handler: primaryHandlers.setExpertise,
    // preHandler: primaryHandlers.checkRole("customer"),
  },
  {
    method: "PUT",
    url: "/profile-info-update/:customer_id",
    handler: primaryHandlers.customer_updateprofile,
    // preHandler: primaryHandlers.checkRole("customer"),
  },
  {
    method: "PUT",
    url: "/customer/update-expertise",
    handler: customerHandler.updateExpertise,
    // preHandler: primaryHandlers.checkRole("customer"),
  },
  {
    method: "GET",
    url: "/get-customer-expertise",
    handler: customerHandler.getCustomerExpertise,
    // preHandler: primaryHandlers.checkRole("customer"),
  },
  {
    method: "GET",
    url: "/client/job-posting/:client_id",
    handler: clientHandlers.getJobviaclientIdHandler,
  },
  {
    method: "GET",
    url: "/client/job-posting-by-client",
    handler: clientHandlers.getJobviaclientIdAndJobIdHandler,
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
    // preHandler: primaryHandlers.checkRole("admin"),
  },
  {
    method: "POST",
    url: "/admin/approve-client",
    handler: adminHandler.approveClientHandler,
    // preHandler: primaryHandlers.checkRole("admin"),
  },
  {
    method: "GET",
    url: "/client",
    handler: clientHandlers.getClientById,
  },
  {
    method: "GET",
    url: "/customer",
    handler: customerHandler.getCustomerById,
  },
  {
    method: "GET",
    url: "/customer-by-email",
    handler: customerHandler.getCustomerByEmailHandler,
  },
  {
    method: "GET",
    url: "/client-by-email",
    handler: clientHandlers.getClientByEmailHandler,
  },
  {
    method: "GET",
    url: "/jobs",
    handler: jobHandler.getAllJobs,
  },
  {
    method: "POST",
    url: "/prepare-test",
    handler: testHandler.getRandomQuestions,
  },
  {
    method: "POST",
    url: "/create-stripe-account",
    handler: clientHandlers.createStripeAccount,
    preHandler: clientValidation.validateSetClientStripeAccount,
  },
  {
    method: "GET",
    url: "/get-candidate-test-questions",
    handler: testHandler.getCandidateTestQuestion,
  },
  {
    method: "GET",
    url: "/get-client-stripe-account",
    handler: clientHandlers.getStripeAccount,
    preHandler: clientValidation.validateGetClientStripeAccount,
  },
  {
    method: "POST",
    url: "/take-test",
    handler: testHandler.takeTest,
    preHandler: authValidation.validateTakeTestBody,
  },
  {
    method: "POST",
    url: "/speech-to-text",
    handler: testHandler.SpeechToTextGeneration,
    //preHandler: authValidation.validateTakeTestBody,
  },
  {
    method: "GET",
    url: "/get-coding-question",
    handler: testHandler.getCodingQuestionHandler,
  },
  {
    method: "POST",
    url: "/execute-code",
    handler: testHandler.executeCode,
  },
  {
    method: "POST",
    url: "/get-code-submit",
    handler: testHandler.getCodingSubmit,
  },
  // {
  //   method: 'GET',
  //   url:'/get-candidates-of-client',
  //   handler: clientHandlers.getCandidatesOfClient
  // },
  {
    method: "GET",
    url: "/get-all-candidates-of-clients-job",
    handler: clientHandlers.getAllCandidatesOfClientJob,
  },
  {
    method: 'GET',
    url:'/get-jobs',
    handler: customerHandler.getJobs
  },
  {
    method:'GET',
    url:'/get-job-candidates',
    handler: jobHandler.getJobCandidates,
    preHandler: jobValidation.getHiredCandidatesValidation
  },
  {
    method: "POST",
    url: "/logout",
    handler: primaryHandlers.logout,
    //preHandler: authValidation.validateTakeTestBody,
  },
  {
    method: "GET",
    url: "/get-client-notification",
    handler: clientHandlers.getNotificationClient,
  }
];

module.exports = { routes };
