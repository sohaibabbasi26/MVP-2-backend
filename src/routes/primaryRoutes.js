const primaryHandlers = require('../handlers/primaryHandlers');
const authValidation = require('../pre-handlers/authValidation');

const routes = [
    {
        method: 'GET',
        url: '/',
        handler: primaryHandlers.serverCheck
    },
    {
        method:'POST',
        url:'/signup',
        handler: primaryHandlers.signup,
        preHandler: authValidation.validateRegister
    },
    {
        method:'POST',
        url:'/login',
        handler:primaryHandlers.login,
        preHandler:authValidation.validateLogin
    },
    {
        method:'POST',
        url:'/gen-random-questions',
        handler: primaryHandlers.getRandomQuestions,
        preHandler:authValidation.validateRandomQuestionGen
    },
    {
        method:'POST',
        url:'/create-positions',
        handler: primaryHandlers.createPositions,
        preHandler:authValidation.validateJobPost
    },
    {
        method:'POST',
        url:'/send-email',
        handler: primaryHandlers.sendMail,
    },
    {
        method: 'POST',
        url:'/take-test',
        handler: primaryHandlers.takeTest,
        preHandler: authValidation.validateTakeTestBody
    },
    {
        method: 'POST',
        url:'/gen-coding-ques',
        handler: primaryHandlers.getCodingQuestion,
        preHandler: authValidation.validateCodingGenBody
    },
    {
        method: 'POST',
        url:'/get-coding-verified',
        handler: primaryHandlers.getCodingVerified,
        preHandler: authValidation.validateCodingVerified
    },
    {
        method: 'GET',
        url: '/get-customer-result',
        handler: primaryHandlers.getCustomerResult,
    },
    {
        method: 'POST',
        url: '/set-hourly-rate',
        handler: primaryHandlers.setHourlyRate,
    },
    {
        method: 'POST',
        url: '/set-expertise',
        handler: primaryHandlers.setExpertise,
    },
];

module.exports = {routes};
