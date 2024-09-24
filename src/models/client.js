const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer");

const Client = sequelize.define("clients", {
  client_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  client_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  account_user_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("Active", "In-Active"),
    defaultValue: "Active",
  },
  assigned_customers: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
  city:{
    type: DataTypes.STRING,
    allowNull: true
  },
  country:{
    type: DataTypes.STRING,
    allowNull: true
  },
  area_code:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  province:{
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Client;
