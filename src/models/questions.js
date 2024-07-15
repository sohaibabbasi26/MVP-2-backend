const { DataTypes } = require('sequelize')
const { sequelize } = require('../../configurations/sequelizePgSQL');

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
    position_id: {
        type: DataTypes.UUID,
    }
});

module.exports = Questions;