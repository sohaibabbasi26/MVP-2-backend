const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer");

const Payment_Customer = sequelize.define("payment_customer", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: "customer_id",
    },
  },
  stripe_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Payment_Customer.hasOne(Customer, { foreignKey: "customer_id" });
Customer.belongsTo(Payment_Customer, { foreignKey: "customer_id" });

module.exports = Payment_Customer;
