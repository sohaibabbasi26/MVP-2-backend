const { Op } = require("sequelize");
const Customer = require("../models/customer");

const getCustomerViaExpertise = async (expertise) => {
  try {
    const customer = await Customer.findAll({
      where: {
        expertise: {
          [Op.contains]: expertise,
        },
      },
    });

    if (customer.length === 0) {
      return { message: `No customer existed with these searched expertise` };
    } else {
      return customer;
    }
  } catch (error) {
    console.log(
      `Error src=>services->customerservice->getCustomerViaExpertise: ${error}`
    );
  }
};
//customers Api
async function getallcustomers() {
  try {
    const result = await Customer.findAll();
    return result;
  } catch (error) {
    console.log(
      `Error while retrieving customers =>src->services->getallcustomers ${error} `
    );
    return;
  }
}

const getCustomerByIdService = async (id) => {
  const client = await Customer.findOne({
    attributes: [
      "customer_id",
      "name",
      "over_all_exp",
      "email",
      "contact_no",
      "applied_through",
      "expertise",
      "position",
      "createdAt",
      "updatedAt",
    ],
    where: {
      customer_id: id,
    },
  });

  //const client= await Client.findByPk(id);

  if (client) {
    return client;
  } else {
    return null;
  }
};

module.exports = {
  getCustomerByIdService,
  getCustomerViaExpertise,
  getallcustomers,
};
