// models/Adminassigned.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer"); // Ensure correct import
const Client = require("./client"); // Ensure correct import
const JobPostings = require("./jobPostings"); // Ensure correct import

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
  client_response: {
    type: DataTypes.ENUM("accept", "pending", "decline"),
    defaultValue: "pending",
    allowNull: false,
  },
  hourly_rate:{
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define the association
Adminassigned.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});
Customer.hasMany(Adminassigned, {
  as: "adminassigneds",
  foreignKey: "customer_id",
});

Adminassigned.belongsTo(Client, {
  as: "client",
  foreignKey: "client_id",
});
Client.hasMany(Adminassigned, {
  as: "adminassigneds",
  foreignKey: "client_id",
});

Adminassigned.belongsTo(JobPostings, {
  as: "job_postings",
  foreignKey: "job_posting_id",
});
JobPostings.hasMany(Adminassigned, {
  as: "adminassigneds",
  foreignKey: "job_posting_id",
});
module.exports = Adminassigned;
