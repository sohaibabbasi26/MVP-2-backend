const { resetPasswordHandler } = require('../handlers/passwordResetHandler');
const primaryHandlers = require('../handlers/primaryHandlers');
const authValidation = require('../pre-handlers/authValidation');
const { validatePasswordReset } = require('../pre-handlers/passwordResetValidation');

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
        url:'/password-reset',
        handler: resetPasswordHandler,
        preHandler: validatePasswordReset
    }
];

module.exports = {routes};
