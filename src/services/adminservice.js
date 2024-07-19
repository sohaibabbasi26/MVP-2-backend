const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");

const Adminassigned = require("../models/admin_assigned_client_customer");
const AdminInterview = require("../models/admin_interview_scheduling");
const { sendMail } = require("../handlers/primaryHandlers");

//Interview scheduling
async function admin_interview_scheduling_service(body) {
  try {
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
      where: { client_id },
    });
    return result;
  } catch (error) {
    console.log(
      `Error while fetching Customer=> src->services->adminservice->getcustomerwithid`,
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
        is_approved:true,
        message: "customer has been approved"
      };
    } else {
        return {
            is_approved:true,
            message: "customer not been approved"
          };
    }
  } catch (error) {
    console.log('error at root project -> services -> adminService.js');
    console.log(error);
  }
};


const fetchClientRequestService= async()=>{
  
  try{
    const clientsWithRequests = await Client.findAll({
      include: {
        model: Client_Requests,
        required: true //inner join
      }
    });


  if(clientsWithRequests){
    return{
      status: 200,
      message: clientsWithRequests
    }
  }else{
    return{
      status: 404,
      message: "no client requests yet"
    }
  }
  }catch(err){
    console.log('error at root project -> services -> adminService.js');
    console.log(err);
    return{
      status: 500,
      message: err
    }
  }
  
}

module.exports={
    approveCustomerService,
    fetchClientRequestService,
    admin_interview_scheduling_service,
    assigningCustomerservice,
    getcustomerwithid
}
