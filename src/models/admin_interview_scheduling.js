const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("./customer");

const AdminInterview = sequelize.define("admin_interviews", {
  interview_id: {
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
  },
  interview_date: {
    type: DataTypes.DATEONLY,
    //interview_time
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  interview_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = AdminInterview;
