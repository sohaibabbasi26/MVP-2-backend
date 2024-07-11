const primaryHandlers = require('../handlers/primaryHandlers');


const routes = [
    {
        method: 'GET',
        url: '/',
        handler: primaryHandlers.serverCheck
    },
];

module.exports = {routes};
