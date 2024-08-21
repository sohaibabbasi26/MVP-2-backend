const Client = require("../models/client");
const {
  assigningCustomerservice,
  getcustomerwithid,
  admin_interview_scheduling_service,
  approveCustomerService,
  fetchClientRequestService,
  approveClientService,
} = require("../services/adminService");
const { updateclient_service } = require("../services/clientservice");
const { checkClientInDb } = require("../utilities/checkClientInDb");
const { encryptPasword } = require("../utilities/encryptPassword");
const { jwtSignature } = require("../utilities/jwtSign");

// Admin registering client
async function registerClientHandler(req, res) {
  try {
    const { name, client_location, email, password, contact_no } = req.body;
    const method = "POST";
    const isClientInDb = await checkClientInDb(email, method);
    if (isClientInDb === true) {
      return `Client with these credentials already exists`;
    } else {
      try {
        const hashedPassword = await encryptPasword(password);
        const newData = {
          name,
          client_location,
          email,
          password: hashedPassword,
          contact_no,
          approved: true,
        };
        const result = await Client.create(newData);
        jwtSignature(result?.dataValues);
        return "Admin has created a new Client Account ", result;
      } catch (err) {
        console.log(
          "ERROR WHILE CREATING CLIENT:",
          err,
          "\n error source :  error source: src -> services -> primaryServices -> signup"
        );
        return "ERROR WHILE CREATING CLIENT:", err;
      }
    }
  } catch (e) {
    console.log("error registering client handler", e);
  }
}

//Client and customer assigned

async function assigningCustomerHandler(req, res) {
  try {
    const data = req.body;
    const result = await assigningCustomerservice(data);
    res.send(result);
  } catch (error) {
    console.error("Error in adminassignedhandler:", error.message);
    res.status(500).send({ error: error.message });
  }
}

//interview api
async function scheduleinterviewhandler(req, res) {
  try {
    const data = req.body;
    if (!data.customer_id) {
      return res.status(400).send({
        message: "customer_id must not be empty",
      });
    }
    if (!data.customer_email) {
      return res.status(400).send({
        message: "customer_email must not be empty",
      });
    }
    if (!data.interview_time) {
      return res.status(400).send({
        message: "interview_time must not be empty",
      });
    }
    if (!data.interview_date) {
      return res.status(400).send({
        message: "interview_date must not be empty",
      });
    } else {
      const result = await admin_interview_scheduling_service(data);
      res.send(result);
    }
  } catch (error) {
    console.log(`Error while posting ${error}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
}
//get customer with client_Id
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

const approveCustomerHandler = async (req, res) => {
  const { customer_id } = req.body;

  if (customer_id) {
    const customerApproveService = await approveCustomerService(customer_id);
    let statusCode = 200;
    if (!customerApproveService.is_approved) {
      statusCode = 404;
    }
    res.status(statusCode).send({
      is_approved: customerApproveService.is_approved,
      message: "customer approved",
    });
  } else {
    res.status(403).rend({
      message: "invalid customer id",
    });
  }
};

const fetchClientRequestHandler = (req, res) => {
  fetchClientRequestService()
    .then((result) => {
      res.status(result.status).send(result.message);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const approveClientHandler = async (req, res) => {
  const { client_id } = req.body;

  if (client_id) {
    const clientApproveService = await approveClientService(client_id);
    let statusCode = 200;
    if (!clientApproveService.approved) {
      statusCode = 404;
    }
    res.status(statusCode).send({
      is_approved: clientApproveService.approved,
      message: "client approved",
    });
  } else {
    res.status(403).rend({
      message: "invalid client id",
    });
  }
};

module.exports = {
  approveCustomerHandler,
  fetchClientRequestHandler,
  getcustomerwithclientid,
  assigningCustomerHandler,
  scheduleinterviewhandler,
  registerClientHandler,
  approveClientHandler,
};
