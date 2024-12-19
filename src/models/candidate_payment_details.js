const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer"); // Ensure correct import

const CandidatePaymentDetails = sequelize.define("candidate_account_details", {
  candidate_acct_id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: "customer_id",
    },
    onDelete: "CASCADE",
  },

  account_holder_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  routing_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  representative_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  representative_last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CandidatePaymentDetails;
