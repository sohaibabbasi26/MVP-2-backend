const Client = require("../models/client");
const Adminassigned = require("../models/admin_assigned_client_customer");

//Client Api
async function getallclients(req, res) {
  try {
    const result = await Client.findAll();
    return result;
  } catch (error) {
    console.log(
      `Error while retrieving client data => src->services->clientservice${error}->getallclients`
    );
    return;
  }
}

async function getcustomerwithid(client_id) {
  try {
    const result = await Adminassigned.findOne({
      where: { client_id },
    });
    return result;
  } catch (error) {
    console.log(
      `Error while fetching Customer=> src->services->clientservice->getcustomerwithid`,
      error
    );
    throw error; // Ensure the error is propagated
  }
}

async function updateclient_service(body, client_id) {
  const data = await Client.findOne({
    where: {
      client_id,
    },
  });
  if (!data) {
    console.log(
      "client not found => src->services->clientservice->updateclient_service"
    );
  }

  await data.update(body);
  return body;
}

module.exports = {
  getallclients,
  getcustomerwithid,
  updateclient_service,
};
