const fastify = require('fastify')({
    logger: true
});
const {routes} = require('./src/routes/primaryRoutes')
require('dotenv').config()

// fastify.get('/',(req,res) => {
//     res.send('SERVER IS RUNNING!')
// })
routes.forEach((route) => {
    fastify.route(route);
});

fastify.listen({ port: process.env.SERVER_PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});