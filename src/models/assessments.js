const { DataTypes } = require('sequelize')
const { sequelize } = require('../../configurations/sequelizePgSQL');

const Assessments = sequelize.define('assessments', {
    assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    assesment: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    jop_position_id: {
        type: DataTypes.UUID,
    },
    customer_id: {
        type: DataTypes.UUID
    }
})

module.exports = Assessments;
