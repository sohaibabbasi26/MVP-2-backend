const Adminassigned = require("../models/admin_assigned_client_customer");
const { Op } = require("sequelize");
const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");
const ClientInterview = require("../models/client_interview_scheduling");
const { sendMail } = require("../handlers/primaryHandlers");
const JobPostings = require("../models/jobPostings");
const Payment_Client = require("../models/payment_client");
const { NotificationClient } = require("../models/notification_client");

//job posting via client_Id
//get job posting via client-Id
async function getJobviaclientIdService(client_id) {
  try {
    const result = await JobPostings.findAll({
      where: {
        client_id,
      },
    });
    return { result, message: "Successfully retrieved Jobs" };
  } catch (error) {
    console.log(`Error is at src->clientservice->getjobviaclientId`);
  }
}

async function getJobviaclientIdAndJobIdService(client_id, job_posting_id) {
  try {
    const result = await JobPostings.findOne({
      where: {
        client_id,
        job_posting_id,
      },
    });
    return { result, message: "Successfully retrieved Jobs" };
  } catch (error) {
    console.log(`Error is at src->clientservice->getjobviaclientId`);
  }
}
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

const client_interview_service = async (body) => {
  try {
    const data = await Customer.findOne({
      where: {
        customer_id: body.customer_id,
      },
    });
    if (data) {
      const schedule = await ClientInterview.create(body);
      if (schedule) {
        const emailData = {
          to: body.customer_email,
          subject: "Interview Scheduled",
          text: `Dear Customer,
                      
Your interview has been scheduled for ${body.interview_date} at ${body.interview_time}.
              
Thank you,
Co-VenTech`,
          user_role: "customer",
        };

        const adminEmailData = {
          to: body.admin_email,
          subject: "Interview Scheduled",
          text: `Dear Admin,
                      
An interview has been scheduled for ${body.interview_date} at ${body.interview_time}.
              
Thank you,
Co-VenTech`,

          user_role: "admin",
        };

        // Send the email
        await sendMail(
          { body: emailData },
          {
            send: (result) => console.log(result),
            status: (code) => ({ send: (message) => console.log(message) }),
          }
        );
        await sendMail(
          { body: adminEmailData },
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
      return { message: "Customer Not existed in the database" };
    }
  } catch (error) {
    return { message: `Error while inserting data ${error}` };
  }
};
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
      "city",
      "area_code",
      "country",
      "province",
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
  job_posting_id,
  talent_status,
  job_status
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
    const job_postings = await JobPostings.findByPk(job_posting_id);

    const assigned_clients = customer.assigned_clients || [];
    const position = customer.position || [];
    const job_assigned_customers = job_postings.assigned_customer;

    const updated_clients = assigned_clients.filter(
      (cli) => cli.client_id !== client_id
    );

    const updated_job_assigned_customers = job_assigned_customers.filter(
      (cus) => cus.customer_id !== customer_id
    );

    const updated_position = position.filter(
      (cus) => cus.job_posting_id !== job_posting_id
    );

    customer.update({
      assigned_clients: updated_clients.length > 0 ? updated_clients : null,
      position: updated_position.length > 0 ? updated_position : null,
      talent_status
    });

    job_postings.update({
      job_status,
      assigned_customer:
        updated_job_assigned_customers.length > 0
          ? updated_job_assigned_customers
          : null,
    });

    await Adminassigned.update(
      {
        client_response: "decline",
      },
      {
        where: {
          job_posting_id: job_posting_id,
          customer_id: customer_id,
          client_id: client_id,
        },
      }
    );

    await NotificationClient.update(
      {
        is_accepted: false,
      },
      {
        where: {
          [Op.and]: [
            { job_posting_id },
            { customer_id: customer_id },
            {
              [Op.or]: [
                { notification_type: 'trial' },
                { notification_type: 'hire' }
              ]
            }
          ]

        }
      }
    )


    return {
      status: 200,
      message: "customer has been deleted",
    };
  } catch (error) {
    console.log(error)
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
    const job_id = body.job_posting_id;
    const job_status = body?.job_status  //hired or trial
    const talent_status = body?.talent_status

    // Fetch the customer and client records
    const customer = await Customer.findOne({
      where: {
        customer_id: customer_id,
      },
    });

    const client = await Client.findOne({
      where: {
        client_id: client_id,
      },
    });

    if (customer && client) {
      // Fetch the job posting record
      //association
      JobPostings.belongsTo(Client, { foreignKey: "client_id" });
      Client.hasMany(JobPostings, { foreignKey: "client_id" });

      const jobPosting = await JobPostings.findOne({
        where: {
          job_posting_id: job_id,
        },
      });

      if (!jobPosting) {
        console.log("Job posting not found");
        return {
          status: 404,
          message: "Job posting not found",
        };
      }

      // Update Adminassigned table
      await Adminassigned.update(
        {
          client_response: 'accept'
        },
        {
          where: {
            job_posting_id: job_id,
          },
        }
      );

      // Update Customer table
      await Customer.update(
        {
          talent_status
        },
        {
          where: {
            customer_id: customer_id,
          },
        });


      // Update Client table with assigned customer if not already assigned
      const assignedCustomers = client.assigned_customers || [];
      const customerExists = assignedCustomers.some(
        (assignedCustomer) => assignedCustomer.customer_id === customer_id
      );
      if (!customerExists) {
        assignedCustomers.push({ customer_id: customer_id });
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
      }

      // Update JobPostings table
      await JobPostings.update(
        {
          job_status,
          assigned_customer: assignedCustomers
        },
        {
          where: {
            job_posting_id: job_id,
          },
        }
      );

      if (body?.job_status === 'trial') {
        await NotificationClient.update(
          {
            is_accepted: true,
          },
          {
            where: {
              [Op.and]: [
                { job_posting_id: job_id },
                { customer_id: body?.customer_id },
                { notification_type: 'trial' }
              ]

            }
          }
        )
      }

      if (body?.job_status === 'hired') {
        await NotificationClient.update(
          {
            is_accepted: true,
          },
          {
            where: {
              [Op.and]: [
                { job_posting_id: job_id },
                { customer_id: body?.customer_id },
                { notification_type: 'hire' }
              ]

            }
          }
        )
      }

      console.log("Update successful");
      return {
        status: 200,
        message: "Customer is Assigned to Given Client",
        body,
      };
    } else {
      console.log("Customer or client not found");
      return {
        status: 404,
        message: "Customer or client not found",
      };
    }
  } catch (error) {
    console.error("Error in clientAcceptService:", error.message);
    return {
      status: 500,
      message: error.message,
    };
  }
};

//client pending service
const clientPendingService = async (body) => {
  try {
    const customer_id = body.customer_id;
    const client_id = body.client_id;
    const job_id = body.job_posting_id;

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
      await Adminassigned.update(
        {
          client_response: "pending",
        },
        {
          where: {
            job_posting_id: body.job_posting_id,
          },
        }
      );
      await JobPostings.update(
        {
          job_status: "hired",
        },
        {
          where: {
            job_posting_id: job_id,
          },
        }
      );
      await Customer.update(
        {
          job_status: "hired",
        },
        {
          where: {
            customer_id: customer_id,
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

const createClientStripeAccountService = async (body) => {
  const { client_id, stripe_id } = body;
  let msg = null;
  try {
    const clientFind = await Client.findOne({
      where: {
        client_id,
      },
    });

    if (!clientFind) {
      return {
        status: 404,
        message: "client not found",
      };
    }
    await Payment_Client.create({
      client_id,
      stripe_id,
    });
    return {
      status: 200,
      message: "account created successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

const getClientStripeAccountService = async (query) => {
  const { client_id } = query;
  try {
    const payment = await Payment_Client.findOne({
      where: {
        client_id,
      },
    });

    if (payment)
      return {
        status: 200,
        message: "client account fetched successfully",
        data: payment,
      };

    return {
      status: 404,
      message: "client account not registered",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

const getCandidatesOfClientService = (data) => {
  try {
    switch (data.filter) {
      case "hired":

      default:
        return {
          status: 401,
          message: "invalid filter",
        };
    }
  } catch (err) {
    return {
      status: 500,
      err: err.message,
    };
  }
};

const getAllCandidatesOfClientJobService = async (
  client_id,
  customer_id,
  job_posting_id
) => {
  try {
    let clientJobsWithCandidates = null;
    if (!customer_id && !job_posting_id) {
      clientJobsWithCandidates = await Adminassigned.findAll({
        where: {
          client_id,
        },
        include: [
          {
            model: Customer,
            Client,
            as: "customer",
            attributes: [
              "customer_id",
              "name",
              "email",
              "experience",
              "hourly_rate",
              "commitment",
              "position",
            ],
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
    } else {
      clientJobsWithCandidates = await Adminassigned.findAll({
        where: {
          client_id,
          customer_id,
          job_posting_id,
        },
        include: [
          {
            model: Customer,
            Client,
            as: "customer",
            attributes: [
              "customer_id",
              "name",
              "email",
              "experience",
              "hourly_rate",
              "commitment",
              "position",
            ],
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
    }
    if (clientJobsWithCandidates) {
      return {
        status: 200,
        data: clientJobsWithCandidates,
      };
    }
  } catch (err) {
    return {
      status: 500,
      err: err.message,
    };
  }
};

const getClientByEmail = async (email) => {
  try {
    const customer = await Client.findOne({
      where: {
        email,
      },
    });

    if (customer) {
      return {
        status: 200,
        data: customer,
      };
    }

    return {
      status: 404,
      message: "client not found",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

const getNotificationClientService = async (client_id, date) => {
  try {

    if (!date) {
      return {
        status: 400,
        message: "Invalid date"
      };
    }

    const notification = await NotificationClient.findAll({
      where: { client_id }
    });

    if (!notification || notification.length === 0) {
      return {
        status: 400,
        message: "No notifications yet"
      };
    }

    const client_notifications = [];

    // Parse input date to a Date object for comparison
    const inputDate = new Date(date);

    for (let n of notification) {
      const notificationData = n.dataValues;
      const sendDate = new Date(notificationData.send_date).toISOString(); //remove toISOString() for the logic of 1 day
      const send_minute= sendDate.split(':')[1] //remove this code for 1 day
      const date_minute= date.split(':')[1]  // remove this code for 1 day
      console.log(parseInt(send_minute)+4) // remove this code for 1 day
      console.log(date_minute)  // remove this code for 1 day

      if (!notificationData.is_sent && parseInt(send_minute)+4 <= parseInt(date_minute)) {
        // If send_date has passed, mark the notification as sent
        await n.update({ is_sent: true });
        console.log(`Notification sent for client ${client_id} on ${inputDate}`);
      } 
      
      if(notificationData.is_sent){
        client_notifications.push(notificationData);
      }

      // Check if the notification is not sent yet
      //this is for code after 1 day
      // if (!notificationData.is_sent) {
      //   // Compare send_date using getTime() to avoid millisecond issues
      //   const sendDate = new Date(notificationData.send_date);
      //   const inputDateObj = new Date(date);


      //   //this is for code after 1 day
      //   if (sendDate.getFullYear() === inputDateObj.getFullYear() &&
      //     sendDate.getMonth() === inputDateObj.getMonth() &&
      //     sendDate.getDate() === inputDateObj.getDate()) {
      //     await n.update({ is_sent: true });
      //     console.log(`Notification sent for client ${client_id} on ${date}`);
      //   }
        
      // } 
      
      // if(notificationData.is_sent){
      //   client_notifications.push(notificationData);
      // }
    }

    return {
      status: 200,
      message: "Notifications fetched successfully",
      data: client_notifications
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    };
  }
};


module.exports = {
  getClientByEmail,
  getClientByIdService,
  getJobviaclientIdAndJobIdService,
  createClientRequestService,
  getallclients,
  updateclient_service,
  clientAcceptService,
  client_interview_service,
  clientPendingService,
  declineCustomerService,
  getJobviaclientIdService,
  createClientStripeAccountService,
  getClientStripeAccountService,
  getCandidatesOfClientService,
  getAllCandidatesOfClientJobService,
  getNotificationClientService
};
