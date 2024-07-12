const {sequelize} = require('../../configurations/sequelizePgSQL')

async function syncModels() {
    try {
        await sequelize.sync({ alter: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

module.exports = {
    syncModels
}