const {
  getCustomerViaExpertise,
  getallcustomers,
} = require("../services/customerservice");
const Op = require("@sequelize/core");
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

module.exports = { customers, getCustomerWithExpertise };
