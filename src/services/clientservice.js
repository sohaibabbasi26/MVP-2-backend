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

const declineCustomerService=async(client_id,customer_id)=>{

  const client= await Client.findByPk(client_id);
  const ass_cust= client.assigned_customers;

  //pehle customer id ko remove kro assigned customers se
  for(let i=0; i<ass_cust.length; i++){

    if(ass_cust[i]['customer_id']===customer_id){
      ass_cust.splice(i,1);
      break;
    }
  }

  

  //phir assigned customer jo array update hua ha usko dubara daalo
  await client.update({ assigned_customers: ass_cust });

  return {
    status: 200,
    message: client
  }
}

module.exports = {
  getClientByIdService,
  createClientRequestService,
  getallclients,
  updateclient_service,
  declineCustomerService
};
