const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");

const JobPostings = sequelize.define("job_postings", {
  job_posting_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expertise: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  job_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Active", "Closed"),
    defaultValue: "Active",
  },
  applied_customers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_test_required: {
    type: DataTypes.BOOLEAN,
  },
  //ADDED job_status because we dont wanna use multiple joins to get status
  job_status: {
    type: DataTypes.ENUM("Fulfilled", "Hired", "Open"), //fulfilled, hired, open
    defaultValue: "Open",
    allowNull: false,
  },

  assigned_customer: {
    type: DataTypes.JSONB,
  },
});

module.exports = JobPostings;
