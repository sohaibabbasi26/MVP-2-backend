const { DataTypes } = require('sequelize');
const {sequelize} = require('../../configurations/sequelizePgSQL');
const { encryptPassword } = require('../utilities/encryptPassword'); // Adjust the path as per your project structure

const Admin = sequelize.define('admins', {
    admin_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (admin, options) => {
            if (admin.password) {
                admin.password = await encryptPassword(admin.password);
            }
        },
        beforeUpdate: async (admin, options) => {
            if (admin.changed('password')) {
                admin.password = await encryptPassword(admin.password);
            }
        }
    }
});

module.exports = Admin;
