const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");

const Adminassigned = require("../models/admin_assigned_client_customer");
const AdminInterview = require("../models/admin_interview_scheduling");
const { sendMail } = require("../handlers/primaryHandlers");
const { Sequelize } = require("sequelize");
const JobPostings = require("../models/jobPostings");

//Interview scheduling
async function admin_interview_scheduling_service(body) {
  try {
    const data = await Customer.findOne({
      where: {
        customer_id: body.customer_id,
      },
    });
    if (data) {
      const schedule = await AdminInterview.create(body);
      if (schedule) {
        const emailData = {
          to: body.customer_email,
          subject: "Interview Scheduled",
          text: `Dear Candidate,
                      
Your interview is scheduled on ${body.interview_date} at ${body.interview_time}.
              
Thank you,
Co-VenTech`,

          user_role: `customer`,
        };

        // Send the email
        await sendMail(
          { body: emailData },
          {
            send: (result) => console.log(result),
            status: (code) => ({ send: (message) => console.log(message) }),
          }
        );

        return { message: "Successfully Scheduled an Interview" };
      } else {
        return { message: "Table not created" };
      }
    } else {
      return { message: "customer not existed in database" };
    }
  } catch (error) {
    console.log(`Error while inserting data ${error}`);
  }
}

//admin assigning customer to client

async function assigningCustomerservice(body) {
  try {
    const existingAssignment = await Adminassigned.findOne({
      where: {
        client_id: body.client_id,
        customer_id: body.customer_id,
        job_posting_id: body.job_posting_id,
      },
    });
    if (existingAssignment) {
      return {
        message: `Customer is already assigned to this client for the given job posting.`,
      };
    }
    const customer = await Customer.findOne({
      where: {
        customer_id: body.customer_id,
      },
    });

    const client = await Client.findOne({
      where: {
        client_id: body.client_id,
      },
    });

    const jobPosting = await JobPostings.findOne({
      where: {
        job_posting_id: body.job_posting_id,
      },
    });

    if (!customer.is_approved) {
      return {
        message: `Customer is not approved.`,
      };
    }
    if (!client.approved) {
      return {
        message: `Client is not approved.`,
      };
    }

    if (customer && client && jobPosting) {
      let position = customer.position || [];
      let assignedClients = customer.assigned_clients || [];
      let assignedCustomers = client.assigned_customers || [];

      // Check if the client_id already exists in assignedClients
      const clientExists = assignedClients.some(
        (assignedClient) => assignedClient.client_id === body.client_id
      );
      if (!clientExists) {
        assignedClients.push({ client_id: body.client_id });
      }

      // Check if the customer_id already exists in assignedCustomers
      const customerExists = assignedCustomers.some(
        (assignedCustomer) => assignedCustomer.customer_id === body.customer_id
      );
      if (!customerExists) {
        assignedCustomers.push({ customer_id: body.customer_id });
      }

      // Check if the job_posting_id already exists in position
      const jobPostingExists = position.some(
        (pos) => pos.job_posting_id === body.job_posting_id
      );
      if (!jobPostingExists) {
        position.push({ job_posting_id: body.job_posting_id });
      }

      await JobPostings.update(
        {
          job_status: "Hired",
          assigned_customer: assignedCustomers,
        },
        {
          where: {
            job_posting_id: body.job_posting_id,
          },
        }
      );

      await Customer.update(
        {
          talent_status: "Hired",
          position: position,
          assigned_clients: assignedClients,
        },
        {
          where: {
            customer_id: body.customer_id,
          },
        }
      );

      await Client.update(
        {
          assigned_customers: assignedCustomers,
        },
        {
          where: {
            client_id: body.client_id,
          },
        }
      );
    }

    const data = await Adminassigned.create(body);
    return { data, message: `Customer is assigned to Client` };
  } catch (e) {
    console.error(`Error while creating data: ${e.message}`, e);
    throw e;
  }
}

//admin is finding client based on his client_id
async function getcustomerwithid(client_id) {
  try {
    const result = await Adminassigned.findOne({
      where: {
        client_id,
        client_response: {
          [Sequelize.Op.or]: ["Accept", "Pending"],
        },
      },
    });
    return result;
  } catch (error) {
    console.log(
      `Error while fetching Customer=> src->services->adminservice->getCustomerWithId`,
      error
    );
    throw error;
  }
}

const approveCustomerService = async (customer_id) => {
  try {
    const is_approved = await Customer.update(
      { is_approved: true },
      {
        where: {
          customer_id,
        },
      }
    );

    if (is_approved > 0) {
      return {
        is_approved: true,
        message: "customer has been approved",
      };
    } else {
      return {
        is_approved: true,
        message: "customer not been approved",
      };
    }
  } catch (error) {
    console.log("error at root project -> services -> adminService.js");
    console.log(error);
  }
};

const approveClientService = async (client_id) => {
  try {
    const approved = await Client.update(
      { approved: true },
      {
        where: {
          client_id,
        },
      }
    );

    if (approved > 0) {
      return {
        approved: true,
        message: "client has been approved",
      };
    } else {
      return {
        is_approved: true,
        message: "client not been approved",
      };
    }
  } catch (error) {
    console.log("error at root project -> services -> adminService.js");
    console.log(error);
  }
};

const fetchClientRequestService = async () => {
  try {
    const clientsWithRequests = await Client.findAll({
      include: {
        model: Client_Requests,
        required: true, //inner join
      },
    });

    if (clientsWithRequests) {
      return {
        status: 200,
        message: clientsWithRequests,
      };
    } else {
      return {
        status: 404,
        message: "no client requests yet",
      };
    }
  } catch (err) {
    console.log("error at root project -> services -> adminService.js");
    console.log(err);
    return {
      status: 500,
      message: err,
    };
  }
};

module.exports = {
  approveCustomerService,
  fetchClientRequestService,
  admin_interview_scheduling_service,
  assigningCustomerservice,
  getcustomerwithid,
  approveClientService,
};
