const fastify = require("fastify")({
  logger: true,
  bodyLimit: 1048576 * 150, // resolve error 413
});
const { routes } = require("../src/routes/primaryRoutes");
require("dotenv").config();
const { syncModels } = require("../src/utilities/syncModels");
const { generateJwtSecret } = require("../src/utilities/jwtSecretGenerator");
const cors = require("@fastify/cors");
const fastifyCookie = require("@fastify/cookie");
const fastifySession = require("@fastify/session");
const fastifyMultipart = require('@fastify/multipart');

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
    origin: process.env.ALLOWED_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });

  fastify.register(fastifyMultipart, {
    limits: {
      files: 7,
      fileSize: 150 * 1024 * 1024, // Set file size limit to 150MB
    }
  })

  // Register routes with /v1 prefix
  fastify.register(async function (fastifyInstance) {
    routes.forEach((route) => {
      fastifyInstance.route(route);
    });
  }, { prefix: "/v1" });  // Add the /v1 prefix here

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
