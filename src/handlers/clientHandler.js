const {
  getallclients,
  updateclient_service,
  getClientByIdService,
  createClientRequestService,
  declineCustomerService,
} = require("../services/clientservice");

//Client Api
async function clients(req, res) {
  try {
    const data = await getallclients();
    res.send(data);
  } catch (error) {
    console.log(`Error while getting clients data ${error}`);
    return;
  }
}

//Client update_profile
async function client_updateprofile(req, res) {
  const body = req.body;
  const client_id = req.params.client_id;

  if (body.password) {
    delete body.password;
  }

  try {
    const data = await updateclient_service(body, client_id);
    res.status(200).send({ data, message: "Profile Updated Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the profile." });
  }
}

const getClientById = async (req, res) => {
  try {
    const { client_id } = req.query;
    const client = await getClientByIdService(client_id);

    if (client) {
      res.status(200).send(client);
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

const createClientRequestHandler = (req, res) => {
  try {
    createClientRequestService(req.body).then((result) => {
      res.status(result.status).send({
        message: result.message,
      });
    });
  } catch (err) {
    console.log("error in root_project -> src -> handlers -> clientHandler.js");
    res.status(500).send({
      message: err,
    });
  }
};

const clientResponseHandler = (req, res) => {
  try {
    const { customer_id, client_id, job_posting_id, response_status } =
      req.body;

    switch (response_status) {
      case "decline":
        declineCustomerService(client_id, customer_id, job_posting_id).then(
          (result) => {
            res.status(result.status).send({
              message: result.message,
            });
          }
        );
        break;
      default:
        res.status(400).send({
          message: "invalid response status",
        });
    }
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

module.exports = {
  clients,
  client_updateprofile,
  getClientById,
  createClientRequestHandler,
  clientResponseHandler,
};
