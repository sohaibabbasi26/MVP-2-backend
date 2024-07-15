const Customer = require("../models/customer");
const {
  getCustomerViaExpertise,
  getallcustomers,
} = require("../services/customerservice");
const Op = require("@sequelize/core");
async function customers(req, res) {
  const data = await getallcustomers();
  res.send(data);
}

const getCustomerWithExpertise = async (req, res) => {
  const { expertise } = req.query;
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
