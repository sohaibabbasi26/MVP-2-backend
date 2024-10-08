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
    schedule_time: {
        type: DataTypes.DATE,
    }
}, {
    hooks: {
        afterCreate: async (notification, options) => {
            // Schedule interview one day after insertion
            const oneDayLater = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

            cron.schedule(oneDayLater, async () => {
                // Trigger interview scheduling logic
                console.log(`Scheduling interview for client ${notification.client_id} after 1 day.`);

                // Example: Update status or send an interview invite
                await NotificationClient.update(
                    { notification_type: 'interview_scheduled' },
                    { where: { notification_id: notification.notification_id } }
                );
            });
        }
    }
});

NotificationClient.hasMany(Client, {
    foreignKey: 'client_id'
});
Client.belongsTo(NotificationClient, {
    foreignKey: 'client_id'
})