const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Admin = require("../models/admin");
const Customer = require("../models/customer");
const Client = require("../models/client");

const ClientInterview = sequelize.define("client_interviews", {
  interview_id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  //   client_id: {
  //     type: DataTypes.UUID,
  //     allowNull: false,
  //     references: {
  //       model: Client,
  //       key: "client_id",
  //     },
  //   },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: "customer_id",
    },
  },
  interview_date: {
    type: DataTypes.DATE,
    //interview_time
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  //   admin_email: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     references: {
  //       model: Admin,
  //       key: "email",
  //     },
  //   },
});

// // Define associations
// Admin.hasMany(ClientInterview, {
//   foreignKey: "admin_email",
//   sourceKey: "email",
// });
// ClientInterview.belongsTo(Admin, {
//   foreignKey: "admin_email",
//   targetKey: "email",
// });

// Customer.hasMany(ClientInterview, {
//   foreignKey: "customer_id",
//   sourceKey: "customer_id",
// });
// ClientInterview.belongsTo(Customer, {
//   foreignKey: "customer_id",
//   targetKey: "customer_id",
// });

// Client.hasMany(ClientInterview, {
//   foreignKey: "client_id",
//   sourceKey: "client_id",
// });
// ClientInterview.belongsTo(Client, {
//   foreignKey: "client_id",
//   targetKey: "client_id",
// });

module.exports = ClientInterview;
