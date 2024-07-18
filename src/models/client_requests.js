const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configurations/sequelizePgSQL");
const Client = require("./client");


const Client_Requests= sequelize.define('client_requests',{
    client_req_id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    client_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: Client,
            key:"client_id"
        }
    },
    expertise: {
        type: DataTypes.JSONB,
    },
    experience:{
        type: DataTypes.STRING,
    }
});

module.exports= {Client_Requests};