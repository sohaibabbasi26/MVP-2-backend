const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");

const JobPostings = sequelize.define("job_postings", {
  job_posting_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Client,
      key: "client_id",
    },
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience:{
    type: DataTypes.ENUM("beginner","intermediate","expert"),
    allowNull: false,
    defaultValue:"beginner"
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  commitment: {
    type: DataTypes.ENUM("full-time", "part-time"),
    defaultValue: "full-time",
    allowNull: false,
  },
  job_type: {
    type: DataTypes.ENUM("on-site", "remote"),
    defaultValue: "on-site",
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "closed"),
    defaultValue: "active",
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
    type: DataTypes.ENUM("fulfilled", "hired", "open", "trial"), //fulfilled, hired, open
    defaultValue: "open",
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Date.now(),
  },
  assigned_customer: {
    type: DataTypes.JSONB,
  },
  application_questions: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  project_length: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hourly_rate:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  workday_overlap: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// //association
// JobPostings.hasMany(Client, { foreignKey: "client_id" });
// Client.belongsTo(JobPostings, { foreignKey: "client_id" });

module.exports = JobPostings;
