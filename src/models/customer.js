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
  contact_no: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.JSONB,
  },
  // job_status: {
  //   type: DataTypes.ENUM("Assigned", "On-Job", "Un-Assigned"),
  //   defaultValue: "Un-Assigned",
  //   allowNull: false,
  // },
  talent_status: {
    type: DataTypes.ENUM("hired", "trial", "interviewing", "open", "fulfilled"),
    defaultValue:'open'
  },
  status: {
    type: DataTypes.ENUM("active", "in-active"),
    defaultValue: "active",
  },
  job_type: {
    type: DataTypes.ENUM("remote", "on-site"),
  },
  notice_period: {
    type: DataTypes.ENUM("1 week", "2 week", "4 week", "immediate"),
  },
  commitment: {
    type: DataTypes.ENUM("full-time", "half-time"),
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
  hourly_rate: {
    type: DataTypes.INTEGER,
  },
  experience: {
    type: DataTypes.ENUM("beginner", "intermediate", "expert"),
  },
});

module.exports = Customer;
