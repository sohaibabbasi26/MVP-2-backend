const fastify = require('fastify')({
    logger: true
});
const {routes} = require('../src/routes/primaryRoutes')
require('dotenv').config()
// const {connectDb} = require('../src/utilities/dbConnection');
const {syncModels} = require("../src/utilities/syncModels");

const serverInit = () => {

    routes.forEach((route) => {
        fastify.route(route);
    });
    
    // connectDb();
    syncModels();
    
    fastify.listen({ port: process.env.SERVER_PORT }, function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
    });
}

module.exports ={
    serverInit
}