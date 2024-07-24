const {sequelize} = require('../../configurations/sequelizePgSQL');
const {DataTypes} = require('sequelize');

const Test = sequelize.define('tests',{
    test_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull: false,
        primaryKey : true
    },
    question_answer : {
        type: DataTypes.JSONB,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

module.exports = Test;