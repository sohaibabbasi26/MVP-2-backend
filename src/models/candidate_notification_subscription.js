const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer");

const CustomerNotificationSubscription = sequelize.define(
  "customer_notification_subscription",
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
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: Customer,
        key: "customer_id",
      },
    },
  }
);

module.exports = CustomerNotificationSubscription;
