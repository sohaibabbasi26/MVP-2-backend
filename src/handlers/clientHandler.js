const { getClientByIdService } = require("../services/clientService");

const getClientById = async (req, res) => {
  try {
    const { client_id } = req.query;
    const client = await getClientByIdService(client_id);

    if (client) {
        res.status(200).send(
            client
        )
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = {
  getClientById,
};
