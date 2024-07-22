const Adminassigned = require("../models/admin_assigned_client_customer");
const { Op } = require("sequelize");
const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");

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

const declineCustomerService = async (
  client_id,
  customer_id,
  job_posting_id
) => {
  try {
    const client = await Client.findByPk(client_id);
    if (!client) {
      return {
        status: 404,
        message: "Client not found",
      };
    }

    const assigned_customers = client.assigned_customers || [];

    // Remove the customer id from assigned customers
    const updated_customers = assigned_customers.filter(
      (cust) => cust.customer_id !== customer_id
    );

    // Update the assigned customers array
    await client.update({
      assigned_customers:
        updated_customers.length > 0 ? updated_customers : null,
    });

    const customer = await Customer.findByPk(customer_id);
    const assigned_clients = customer.assigned_clients || [];

    const updated_clients = assigned_clients.filter(
      (cli) => cli.client_id !== client_id
    );

    customer.update({ job_status: "Un-Assigned", assigned_clients:
      updated_clients.length > 0 ? updated_clients : null});

    await Adminassigned.update(
      {
        client_response: "Decline",
      },
      {
        where: {
          job_posting_id: job_posting_id,
          customer_id:customer_id,
          client_id:client_id
        },
      }
    )

    return {
      status: 200,
      message: "customer has been deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

//client accept service
const clientAcceptService = async (body) => {
  try {
    const customer_id = body.customer_id;
    const client_id = body.client_id;
    console.log(body.job_posting_id);
    //Updating Customer_Table
    const customer = await Customer.findOne({
      where: {
        customer_id: customer_id,
      },
    });
    //Updating client_Table
    const client = await Client.findOne({
      where: {
        client_id: client_id,
      },
    });
    if (customer && client) {
      let assignedClients = customer.assigned_clients || [];
      let assignedCustomers = client.assigned_customers || [];
      assignedClients.push({ client_id: body.client_id });
      assignedCustomers.push({ customer_id: body.customer_id });
      await Adminassigned.update(
        {
          client_response: "Accept",
        },
        {
          where: {
            job_posting_id: body.job_posting_id,
          },
        }
      );
      await Customer.update(
        {
          job_status: "On-Job",
          assigned_clients: assignedClients,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );
      await Client.update(
        {
          assigned_customers: assignedCustomers,
        },
        {
          where: {
            client_id: client_id,
          },
        }
      );

      console.log("Update successful");
      return {
        status: 200,
        message: "Customer is Assigned to Given Client",
        body,
      };
    } else {
      console.log("Customer not found");
      return;
    }
  } catch (error) {
    console.error("Error in clientAccept Service:", error.message);
  }
};

//client pending service
const clientPendingService = async (body) => {
  try {
    const customer_id = body.customer_id;
    const client_id = body.client_id;
    //Updating Customer_Table
    const customer = await Customer.findOne({
      where: {
        customer_id: customer_id,
      },
    });
    //Updating client_Table
    const client = await Client.findOne({
      where: {
        client_id: client_id,
      },
    });
    if (customer && client) {
      let assignedClients = customer.assigned_clients || [];
      let assignedCustomers = client.assigned_customers || [];
      assignedClients.push({ client_id: body.client_id });
      assignedCustomers.push({ customer_id: body.customer_id });
      await Adminassigned.update(
        {
          client_response: "Pending",
        },
        {
          where: {
            job_posting_id: body.job_posting_id,
          },
        }
      );
      await Customer.update(
        {
          job_status: "Assigned",
          assigned_clients: assignedClients,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );
      await Client.update(
        {
          assigned_customers: assignedCustomers,
        },
        {
          where: {
            client_id: client_id,
          },
        }
      );

      console.log("Update successful");
      return {
        status: 200,
        message: "Client has added customer in Pending",
        body,
      };
    } else {
      console.log("Customer not found");
      return;
    }
  } catch (error) {
    console.error("Error in clientAccept Service:", error.message);
  }
};
module.exports = {
  getClientByIdService,
  createClientRequestService,
  getallclients,
  updateclient_service,
  clientAcceptService,
  clientPendingService,
  declineCustomerService,
};
