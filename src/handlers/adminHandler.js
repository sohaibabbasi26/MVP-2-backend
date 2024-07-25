const {
  assigningCustomerservice,
  getcustomerwithid,
  admin_interview_scheduling_service,
  approveCustomerService,
  fetchClientRequestService,
} = require("../services/adminService");
const { updateclient_service } = require("../services/clientservice");

//Client and customer assigned

async function assigningCustomerHandler(req, res) {
  try {
    const data = req.body;
    const result = await assigningCustomerservice(data);
    // const body = {
    //   assigned_customers: result.assigned_customers.concat([
    //     { customer_id: data.customer_id },
    //   ]),
    // };
    // await updateclient_service(body, data.client_id);
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

module.exports = {
  approveCustomerHandler,
  fetchClientRequestHandler,
  getcustomerwithclientid,
  assigningCustomerHandler,
  scheduleinterviewhandler,
};
