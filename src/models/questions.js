const { DataTypes } = require('sequelize')
const { sequelize } = require('../../configurations/sequelizePgSQL');
const Customer = require('./customer');

const Questions = sequelize.define('questions', {
    question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    question: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    // position_id: {
    //     type: DataTypes.UUID,
    // }
    customer_id:{
        type: DataTypes.UUID,
        references:{
            model: Customer,
            key: 'customer_id'
        }
    }
});

Questions.hasMany(Customer,{foreignKey:'customer_id'})
Customer.belongsTo(Questions,{foreignKey:'customer_id'})

module.exports = Questions;