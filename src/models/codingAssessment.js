const {sequelize} = require('../../configurations/sequelizePgSQL');
const {DataTypes} = require('sequelize');
const Customer = require('./customer');


const CodingAssessment = sequelize.define('codingAssessment',{
    assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    assesment: {
        type: DataTypes.JSONB,
        allowNull:false
    },
    // position_id : {
    //     type: DataTypes.UUID,
    // },
    customer_id: {
        type : DataTypes.UUID,
        references:{
            model: Customer,
            key:'customer_id'
        }
    }
})

CodingAssessment.hasOne(Customer,{foreignKey:'customer_id'});
Customer.belongsTo(CodingAssessment,{foreignKey:'customer_id'});
module.exports=CodingAssessment;