const { sequelize } = require('../../configurations/sequelizePgSQL');
const Customer = require('../models/customer');
const {checkCustomerInDb} = require('../utilities/checkCustomerExists');
const { encryptPasword } = require('../utilities/encryptPassword');

async function signup(data) {
    try {
        console.log('data in service:', data);
        checkCustomerInDb(data?.customer_id);
        if (checkIfCustomerExists) {
            return `User with these credentials already exists`;
        } else {
            try {
                const hashedPassword = encryptPasword(data?.password);
                const result = await Customer.create(data);
                console.log("Created User:", result);
                return "User has been created successfully."
            } catch (err) {
                console.log("ERROR WHILE CREATING CUSTOMER:",err,'\n error source :  error source: src -> services -> primaryServices')
            }
        }
    } catch (err) {
        console.log('some error occured while signing up:', err, '\n error source: src -> services -> primaryServices');
        return "Some error occured while signing up";
    }
}

module.exports = {
    signup
} 
