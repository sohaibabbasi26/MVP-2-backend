const {
  getCustomerViaExpertise,
  customerUpdateExpertise,
  getallcustomers,
  getCustomerByIdService,
} = require("../services/customerservice");

//getting all the customers
async function customers(req, res) {
  try {
    const data = await getallcustomers();
    res.send(data);
  } catch (error) {
    console.log(`Error while getting customers data ${error}`);
    return;
  }
}
//getting all the customers with their expertise
const getCustomerWithExpertise = async (req, res) => {
  const { expertise } = req.body;
  console.log("expertise: ", expertise);

  if (expertise) {
    const getClients = await getCustomerViaExpertise(expertise);
    res.status(200).send(getClients);
  } else {
    res.status(403).send({
      message: "invalid expertise",
    });
  }
};
//update expertise of customer
const updateExpertise = async (req, res) => {
  try {
    const body = req.body;
    const result = await customerUpdateExpertise(body);
    res
      .status(200)
      .send({ result, message: "Expertise is updated at your profile" });
  } catch (error) {
    console.log(`Error while updating Expertise ${error}`);
  }
};
const getCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.query;
    const customer = await getCustomerByIdService(customer_id);

    if (customer) {
      res.status(200).send({
        customer: customer,
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = {
  getCustomerById,
  customers,
  getCustomerWithExpertise,
  updateExpertise,
};
