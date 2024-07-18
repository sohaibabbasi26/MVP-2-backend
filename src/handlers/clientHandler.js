const {
  getallclients,
  updateclient_service,
  getcustomerwithid,
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

async function client_updateprofile(req, res) {
  const body = req.body;
  const client_id = req.params.client_id;
  console.log(client_id);

  if (body.password) {
    delete body.password;
  }
  console.log(body);

  updateclient_service(body, client_id)
    .then((data) => {
      console.log(data);
      res.send({ message: "Profile Updated Successfully" });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the profile." });
    });
}

async function getcustomerwithclientid(req, res) {
  try {
    const client_id = req.params.client_id;
    console.log(client_id);
    const data = await getcustomerwithid(client_id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (error) {
    console.log(
      `Error finding requested customer => src->handlers->get_customer_with_clientid-handler`,
      error
    );
    res
      .status(500)
      .send({ message: "An error occurred while fetching the customer." });
  }
}

module.exports = {
  clients,
  client_updateprofile,
  getcustomerwithclientid,
};
