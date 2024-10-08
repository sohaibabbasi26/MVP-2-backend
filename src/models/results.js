const {sequelize} = require('../../configurations/sequelizePgSQL');
const {DataTypes} = require('sequelize');
const Customer = require('./customer');

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
        references:{
            model: Customer,
            key:'customer_id'
        },
    }
})

Customer.hasOne(Result,{foreignKey:'customer_id'});
Result.belongsTo(Customer,{foreignKey:'customer_id'});

module.exports= Result;