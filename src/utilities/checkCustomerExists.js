const Customer = require('../models/customer');


const checkCustomerInDb = async (customerId) => {
    try{
        const checkIfCustomerExists = await Customer.findOne({
            where: {
                customer_id: customerId
            }
        })
    
        if (checkIfCustomerExists){
            return true;
        } else {
            return false
        }
    } catch(e){
        console.log("ERROR WHILE CHECKING:", e, "\n error source : src -> utilities -> checkCustomerExists")
    }
}

module.exports = { checkCustomerInDb }