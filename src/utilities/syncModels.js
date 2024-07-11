const {sequelize} = require('../../configurations/sequelizePgSQL')

async function syncModels() {
    try {
        // Alter true will update the table if needed
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

module.exports = {
    syncModels
}