const { DataTypes } = require('sequelize')
const { sequelize } = require('../../configurations/sequelizePgSQL');

const CodingResults = sequelize.define('coding_results', {
    coding_results_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    result : {
        type : DataTypes.JSONB,
        allowNull: false
    },
    customer_id : {
        type : DataTypes.UUID,
        allowNull:false
    }
});

module.exports = CodingResults;