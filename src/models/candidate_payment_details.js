const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer"); // Ensure correct import

const CandidatePaymentDetails = sequelize.define("candidate_payment_details", {
  candidate_payment_id: {
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
  
  account_title:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   iban_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CandidatePaymentDetails;
