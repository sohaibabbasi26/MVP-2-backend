const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");

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
};
