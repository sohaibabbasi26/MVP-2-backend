const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");

const Adminassigned = require("../models/admin_assigned_client_customer");
const AdminInterview = require("../models/admin_interview_scheduling");
const { sendMail } = require("../handlers/primaryHandlers");
const { Sequelize, Op } = require("sequelize");
const JobPostings = require("../models/jobPostings");
const { NotificationClient } = require("../models/notification_client");
const Result = require("../models/results");

const scheduleInterview = async (body, interviewDate) => {
  const notificationDate = new Date(interviewDate);
  notificationDate.setDate(notificationDate.getDate() + 1); // Schedule for one day later

  const notification = await NotificationClient.create(body);

  console.log('Notification scheduled:', notification);
  return notification
};

//Interview scheduling
async function admin_interview_scheduling_service(body) {
  try {
    //console.log(body)
    const data = await Customer.findOne({
      where: {
        customer_id: body.customer_id,
      },
    });

    const job = await JobPostings.findOne({
      where: {
        job_posting_id: body.job_posting_id,
      },
    });
    if (data) {
      const schedule = await AdminInterview.create(body);

      if (schedule) {
        const notification = scheduleInterview({
          job_posting_id: body?.job_posting_id,
          message: `Your interview with candidate ${data?.name} for the job ${job?.position} has been completed. Do you want to accept that candidate for TRIAL?`,
          client_id: body?.client_id,
          customer_id: body?.customer_id,
          notification_type: 'trial'
        }, body?.interview_date)
        // const notification= NotificationClient.create({
        //   job_posting_id: body?.job_posting_id,
        //   message: `Your interview with candidate ${data?.name} for the job ${job?.job_posting_id} has been completed. Do you want to accept that candidate for TRIAL?`,
        //   client_id: body?.client_id,
        //   customer_id: body?.customer_id,
        //   notification_type: 'trial'
        // })

        if (!notification) {
          return {
            status: 401,
            message: 'notification not created'
          }
        }
      }
      return {
        status: 200,
        message: 'interview is scheduled successfully'
      }
      //       if (schedule) {
      //         const emailData = {
      //           to: body.customer_email,
      //           subject: "Interview Scheduled",
      //           text: `Dear Candidate,

      // Your interview is scheduled on ${body.interview_date} at ${body.interview_time}.

      // Thank you,
      // Co-VenTech`,

      //           user_role: `customer`,
      //         };

      //         // Send the email
      //         await sendMail(
      //           { body: emailData },
      //           {
      //             send: (result) => console.log(result),
      //             status: (code) => ({ send: (message) => console.log(message) }),
      //           }
      //         );

      //         return { message: "Successfully Scheduled an Interview" };
      //       } else {
      //         return { message: "Table not created" };
      //       }
    }
    return {
      status: 404,
      message: "customer not existed in database"
    };

  } catch (error) {
    console.log(`Error while inserting data ${error}`);
    return {
      status: 500,
      message: error.message
    }
  }
}

//admin assigning customer to client

async function assigningCustomerservice(body) {
  try {
    const existingAssignment = await Adminassigned.findOne({
      where: {
        [Op.and]: [
          { client_id: body?.client_id },
          { customer_id: body?.customer_id },
          { job_posting_id: body?.job_posting_id },
        ]
      },
    });
    if (existingAssignment) {
      return {
        status: 409,
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

    // if (!customer.is_approved) {
    //   return {
    //     message: `Customer is not approved.`,
    //   };
    // }
    // if (!client.approved) {
    //   return {
    //     message: `Client is not approved.`,
    //   };
    // }

    console.log("/////////////////////", customer)
    console.log("!!!!!!!!!!!!!!!!!!!!!", client)
    console.log("@@@@@@@@@@@@@@@@@@", jobPosting)

    if (!customer) {
      return {
        status: 404,
        message: "customer not found"
      }
    }

    if (!client && jobPosting) {
      return {
        status: 404,
        message: "client not found"
      }
    }

    if (!jobPosting) {
      return {
        status: 404,
        message: "job post not found"
      }
    }
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

    console.log("////////////////////////////////////////////////////////", assignedCustomers)
    await JobPostings.update(
      {
        //job_status: "interviewing",
        assigned_customer: assignedCustomers,
        hourly_rate: body?.hourly_rate
      },
      {
        where: {
          job_posting_id: body.job_posting_id,
        },
      }
    );

    await Customer.update(
      {
        talent_status: "interviewing",
        position: position,
        assigned_clients: assignedClients,
        //hourly_rate: body.hourly_rate
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
    const data = await Adminassigned.create(body);
    return {
      status: 200,
      data, message: `Customer is assigned to Client`
    };


  } catch (e) {
    console.error(`Error while creating data: ${e.message}`, e);
    return {
      status: 500,
      message: e.message
    }
  }
}

//admin is finding client based on his client_id
async function getcustomerwithid(client_id) {
  try {
    const result = await Adminassigned.findOne({
      where: {
        client_id,
        client_response:'pending'
      },
      include: [
        {
          model: Customer,
          Client,
          as: "customer",
          attributes: ["customer_id", "name", "email", "experience", "hourly_rate", "commitment", "position"],
        },
        {
          model: Client,
          as: "client", // Alias for Client association
          attributes: ["client_id", "name", "email"],
        },
        {
          model: JobPostings,
          as: "job_postings", // Alias for Client association
          attributes: [
            "job_posting_id",
            "position",
            "skills",
            "job_type",
            "description",
            "applied_customers_count",
            "assigned_customer",
            "location",
          ],
        },
      ],
    });

    // const customer_id = result?.customer?.customer_id;
    // const customer_result = Result.findOne({
    //   where: {
    //     customer_id
    //   }
    // })

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
