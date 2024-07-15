const { getCustomerByIdService } = require("../services/customerService");

const getCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.query;
    const customer = await getCustomerByIdService(customer_id);

    if (customer) {
        res.status(200).send({
            customer:customer
        })
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = {
  getCustomerById,
};
