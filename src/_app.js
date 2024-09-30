const fastify = require("fastify")({
  logger: true,
});
const { routes } = require("../src/routes/primaryRoutes");
require("dotenv").config();
const { syncModels } = require("../src/utilities/syncModels");
const { generateJwtSecret } = require("../src/utilities/jwtSecretGenerator");
const cors = require("@fastify/cors");
const fastifyCookie = require("@fastify/cookie");
const fastifySession = require("@fastify/session");

fastify.register(fastifyCookie); // Register this first

// Then register fastify-session after fastify-cookie is registered
fastify.register(fastifySession, {
  secret: process.env.SESSION_KEY,
  cookie: {
    secure: true, // Set to true for production with HTTPS
    maxAge: 1800000,
  },
  saveUninitialized: false,
  resave: false,
});

const serverInit = () => {
  fastify.register(cors, {
    origin: process.env.ALLOWED_CLIENT || "*",
  });

  routes.forEach((route) => {
    fastify.route(route);
  });

  syncModels();
  const jwtSecret = generateJwtSecret();
  console.log("Generated JWT secret:", jwtSecret);

  fastify.listen(
    { port: process.env.SERVER_PORT, host: process.env.SERVER_HOST },
    function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  );
};

module.exports = {
  serverInit,
};
