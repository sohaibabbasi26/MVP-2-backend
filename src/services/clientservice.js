const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");

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

const getClientByIdService = async (id) => {
  const client = await Client.findOne({
    attributes: [
      "client_location",
      "name",
      "account_user_name",
      "email",
      "contact_no",
      "status",
      "approved",
      "createdAt",
      "updatedAt",
    ],
    where: {
      client_id: id,
    },
  });

  //const client= await Client.findByPk(id);

  if (client) {
    return client;
  } else {
    return null;
  }
};

const createClientRequestService = async (body) => {
  try {
      const createRequest = await Client_Requests.create(body);

      if (createRequest) {
        return {
          status: 200,
          message: "client request created successfully",
        };
      }
    
  } catch (err) {
    return {
      status: 404,
      message: "client id not found",
    };
  }
};

module.exports = {
  getClientByIdService,
  createClientRequestService,
  getallclients,
  updateclient_service,
};
