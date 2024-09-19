const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");

const Payment_Client = sequelize.define("payment_client", {
  payment_client_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Client,
      key: "client_id",
    },
  },
  stripe_id:{
    type: DataTypes.STRING,
    allowNull: false
  }
});

Payment_Client.hasOne(Client,{foreignKey:'client_id'})
Client.belongsTo(Payment_Client,{foreignKey:'client_id'})

module.exports= Payment_Client;
