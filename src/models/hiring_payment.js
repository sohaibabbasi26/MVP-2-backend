const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");
const Customer = require("./customer");
const JobPostings = require("./jobPostings");

const HiringPayment= sequelize.define('hiring_payment',{
    hiring_payment_id:{
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
    job_posting_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobPostings,
            key: "job_posting_id",
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
    stripe_client_id:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    subscription_id:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount:{
        type: DataTypes.INTEGER,
        allowNull: true,
        //defaultValue:0
    },
    payment_method_id:{
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports= HiringPayment;