const Client = require('../models/client');
const { Op } = require('sequelize');


const checkClientInDb = async (email, method) => {
    try {
        const customer = await Client.findOne({
            where: {
                email:email
            }
        });
        if(method === 'signup'){
            if(customer){
                return true;
            } else{
                return false;
            }
        } else if(method === 'login'){
            if(customer){
                return customer;
            } else{
                return "Couldn't find any customer";
            }
        }
    } catch (error) {
        console.error("ERROR WHILE CHECKING:", error);
        throw error; 
    }
};

module.exports = { checkClientInDb }