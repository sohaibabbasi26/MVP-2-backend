const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");

const ClientNotificationSubscription = sequelize.define(
  "client_notification_subscription",
  {
    notification_subscription_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    endpoint: {
      type: DataTypes.STRING,
    },
    p256dh: {
      type: DataTypes.STRING,
    },
    auth: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: Client,
        key: "client_id",
      },
    },
  }
);

module.exports = ClientNotificationSubscription;
