const { approveCustomerHandler } = require('../handlers/adminHandler');
const { getClientById } = require('../handlers/clientHandler');
const { getCustomerById } = require('../handlers/customerHandler');
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
    },
    {
        method:'GET',
        url:'/client',
        handler: getClientById
    },
    {
        method:'GET',
        url:'/customer',
        handler: getCustomerById
    },
    {
        method:'POST',
        url: '/admin/approve-customer',
        handler: approveCustomerHandler
    }
];

module.exports = {routes};
