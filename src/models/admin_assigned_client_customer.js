const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer");
const Client = require("./client");
const JobPostings = require("./jobPostings");
const Adminassigned = sequelize.define("admin_assigned_customer", {
  admin_assigned_id: {
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
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Client,
      key: "client_id",
    },
    onDelete: "CASCADE",
  },
  job_posting_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: JobPostings,
      key: "job_posting_id",
    },
    onDelete: "CASCADE",
  },
  //extra work
  client_response: {
    type: DataTypes.ENUM("Accept", "Pending", "Decline"),
    defaultValue: "Pending",
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Adminassigned;
