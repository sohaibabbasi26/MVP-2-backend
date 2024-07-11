const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
dotenv.config();

const sequelize = new Sequelize( {
    port: process.env.DB_PORT || 5432,
    // username: process.env.DB_USER,

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: process.env.DB_DIALECT,
    logging: console.log,  // Enable logging for development
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {
    sequelize
}

