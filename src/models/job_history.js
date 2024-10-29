const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");
const Customer = require("./customer");

const JobHistory = sequelize.define('job_history', {
    job_posting_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Client,
            key: "client_id",
        },
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Customer,
            key: "customer_id",
        },
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Date.now(),
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    }
})