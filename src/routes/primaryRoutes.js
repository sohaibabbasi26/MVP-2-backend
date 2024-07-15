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
    }
];

module.exports = {routes};
