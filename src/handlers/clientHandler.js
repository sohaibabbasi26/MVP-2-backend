const {
  getallclients,
  updateclient_service,
  getClientByIdService,
  createClientRequestService,
  clientAcceptService,
  clientPendingService,
  declineCustomerService,
  client_interview_service,
  getJobviaclientIdService,
  createClientStripeAccountService,
  getClientStripeAccountService,
  getJobviaclientIdAndJobIdService,
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
//job posting via clientid
async function getJobviaclientIdHandler(req, res) {
  try {
    const client_id = req.params.client_id;
    const result = await getJobviaclientIdService(client_id);
    res.send(result);
  } catch (error) {
    console.log(`Error fetching Job ${error}`);
  }
}

async function getJobviaclientIdAndJobIdHandler(req, res) {
  try {
    const {client_id,job_posting_id} = req.query;
    const result = await getJobviaclientIdAndJobIdService(client_id,job_posting_id);
    res.send(result);
  } catch (error) {
    console.log(`Error fetching Job ${error}`);
  }
}

//Client update_profile
async function client_updateprofile(req, res) {
  const body = req.body;
  const client_id = req.params.client_id;

  if (body.password) {
    delete body.password;
  }
  if (body.email) {
    delete body.email;
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
    if(!client_id){
      res.status(400).send({
        status: 400,
        message:"client_id is required in params"
      })
    }
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

//client interview api
async function clientinterviewhandler(req, res) {
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
  }
  if (!data.admin_email) {
    return res.status(400).send({
      message: "admin_email must not be empty",
    });
  }

  try {
    const result = await client_interview_service(data);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while scheduling the interview.",
      error: error.message,
    });
  }
}

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
      case "accept":
        clientAcceptService(req.body).then((result) => {
          res.status(result.status).send({
            message: result.message,
            body: result.body,
          });
        });
        break;
      case "pending":
        clientPendingService(req.body).then((result) => {
          res.status(result.status).send({
            message: result.message,
            body: result.body,
          });
        });
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

const createStripeAccount= async(req,res)=>{
  const result= await createClientStripeAccountService(req.body);
  res.status(result.status).send({...result})
}

const getStripeAccount= async(req,res)=>{
  const result= await getClientStripeAccountService(req.query);
  res.status(result.status).send({...result})
}

module.exports = {
  clients,
  client_updateprofile,
  getClientById,
  clientResponseHandler,
  createClientRequestHandler,
  clientinterviewhandler,
  getJobviaclientIdHandler,
  createStripeAccount,
  getStripeAccount,
  getJobviaclientIdAndJobIdHandler
};
