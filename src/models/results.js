const {sequelize} = require('../../configurations/sequelizePgSQL');
const {DataTypes} = require('sequelize');

const Result = sequelize.define('results',{
    result_id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    result : {
        type : DataTypes.JSONB,
        allowNull: false
    },
    test_id: {
        type : DataTypes.UUID,
        allowNull : false,
    },
    customer_id : {
        type : DataTypes.UUID,
        allowNull:false
    }
})

module.exports= Result;