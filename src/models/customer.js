const { DataTypes } = require('sequelize')
const { sequelize } = require('../../configurations/sequelizePgSQL');

const Customer = sequelize.define('customers', {
    customer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
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
    client_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_no: {
        type: DataTypes.STRING,
    },
    is_approved:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Customer
