const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");
const JobPostings = require("./jobPostings");
const Customer = require("./customer");

const NotificationClient = sequelize.define('notification_client', {
    notification_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_id: {
        type: DataTypes.UUID,
        references: {
            model: Client,
            key: 'client_id'
        }
    },
    notification_type: {
        type: DataTypes.ENUM('trial', 'hire', 'info', 'interview_scheduled'),
        allowNull: true
    },
    job_posting_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: JobPostings,
            key: 'job_posting_id'
        }
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Customer,
            key: 'customer_id'
        }
    },
    is_accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    send_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_sent:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: (notification, options) => {
            // // Set send_date to 1 day after the current date
            // const oneDayLater = new Date();
            // oneDayLater.setDate(oneDayLater.getDate() + 1);
            // notification.send_date = oneDayLater;

            // Set send_date to 1 minute after the current date
            const oneMinuteLater = new Date();
            oneMinuteLater.setMinutes(oneMinuteLater.getMinutes() + 1);
            notification.send_date = oneMinuteLater;
        }
    }
});

NotificationClient.hasMany(Client, {
    foreignKey: 'client_id'
});
Client.belongsTo(NotificationClient, {
    foreignKey: 'client_id'
});

module.exports = {
    NotificationClient
};
