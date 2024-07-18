const { Op } = require("sequelize");
const Customer = require("../models/customer");

const getCustomerViaExpertise = async (expertise) => {
  const customer = await Customer.findAll({
    where: {
      expertise: {
        [Op.contains]: expertise,
      },
    },
  });

  if (customer) {
    return customer;
  } else {
    return null;
  }
};
//customers Api
async function getallcustomers() {
  try {
    const result = await Customer.findAll();
    return result;
  } catch (error) {
    console.log(
      `Error while retrieving customers =>src->services->customerservice ${error} `
    );
    return;
  }
}
module.exports = {
  getCustomerViaExpertise,
  getallcustomers,
};
