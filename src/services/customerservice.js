const { Op } = require("sequelize");
const Customer = require("../models/customer");
const Test = require("../models/test");
const CodingResults = require("../models/codingResults");
//get coding_test result of a customer
const getcodingresultService = async (customer_id) => {
  try {
    const data = await CodingResults.findOne({
      where: {
        customer_id,
      },
    });
    if (data) {
      return {
        data,
        message: `Successfully retrieved Data`,
      };
    } else {
      return { message: `No tests Data for given Customer` };
    }
  } catch (error) {
    return error;
  }
};
//get test of certain customer
const getCustomertestsService = async (customer_id) => {
  try {
    const data = await Test.findOne({
      where: {
        customer_id,
      },
    });
    if (data) {
      return {
        data,
        message: `Successfully retrieved Data`,
      };
    } else {
      return { message: `No tests Data for given Customer` };
    }
  } catch (error) {
    console.log(`Error while getting tests for customer`);
  }
};

//get customer by expertise
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
//add expertise of customer
async function customerUpdateExpertise(body) {
  try {
    const customer_id = body.customer_id;
    const expertise = body.expertise;
    const customer = await Customer.findOne({
      where: {
        customer_id,
      },
    });
    if (customer) {
      await Customer.update(
        {
          expertise: expertise,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );
    }
    return body;
  } catch (error) {
    console.log(`Error while updating Expertise ${error}`);
  }
}
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
//get customer by id
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
  customerUpdateExpertise,
  getCustomertestsService,
  getcodingresultService,
};
