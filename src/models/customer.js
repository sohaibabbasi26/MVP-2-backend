const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");

const Customer = sequelize.define("customers", {
  customer_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  over_all_exp: {
    type: DataTypes.STRING,
  },
  applied_through: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  expertise: {
    type: DataTypes.JSONB,
  },

  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_no: {
    type: DataTypes.STRING,
  },
  job_status: {
    type: DataTypes.ENUM("Assigned", "On-Job", "Un-Assigned"),
    defaultValue: "Un-Assigned",
    allowNull: false,
  },
  assigned_clients: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Customer;
