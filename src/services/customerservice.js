const { Op } = require("sequelize");
const Customer = require("../models/customer");
const Test = require("../models/test");
const CodingResults = require("../models/codingResults");
const Adminassigned = require("../models/admin_assigned_client_customer");
const JobPostings = require("../models/jobPostings");
const CandidatePaymentDetails = require('../models/candidate_payment_details');
const Payment_Customer = require("../models/payment_customer");
const { NotificationCandidates } = require("../models/notification_candidates");

//get coding_test result of a customer
const getcodingresultService = async (customer_id) => {
  try {
    const data = await CodingResults.findOne({
      where: {
        customer_id,
      },
    });
    if (data) {
      return {
        data,
        message: `Successfully retrieved Data`,
      };
    } else {
      return { message: `No tests Data for given Customer` };
    }
  } catch (error) {
    return error;
  }
};
//get test of certain customer
const getCustomertestsService = async (customer_id) => {
  try {
    const data = await Test.findOne({
      where: {
        customer_id,
      },
    });
    if (data) {
      return {
        data,
        message: `Successfully retrieved Data`,
      };
    } else {
      return { message: `No tests Data for given Customer` };
    }
  } catch (error) {
    console.log(`Error while getting tests for customer`);
  }
};

//get customer by expertise
const getCustomerViaExpertise = async (expertise) => {
  try {
    const customer = await Customer.findAll({
      where: {
        expertise: {
          [Op.contains]: expertise,
        },
      },
    });

    if (customer.length === 0) {
      return { message: `No customer existed with these searched expertise` };
    } else {
      return customer;
    }
  } catch (error) {
    console.log(
      `Error src=>services->customerservice->getCustomerViaExpertise: ${error}`
    );
  }
};

async function getCandidatePaymentService(customer_id){
  
    // Check if the customer exists
    const customer = await Customer.findOne({ where: { customer_id } });
    if (!customer) {
      return{
        status:404,
        message:'Customer not found',
      };
    }

    const payment_detail = await CandidatePaymentDetails.findOne({where:{customer_id}});

    if(payment_detail){
      return{
        status:200,
        message:'candidate payment details successfully found.',
        data: payment_detail
      };
    }

    return {
      status: 404,
      message: "Payment details not found",
    };
}

async function addCandidatePayment(body){
  const {
    customer_id,
    account_holder_name,
    account_type,
    account_number,
    routing_number,
    representative_first_name,
    representative_last_name
  } = body;

    // Check if the customer exists
    const customer = await Customer.findOne({ where: { customer_id } });
    if (!customer) {
      return{
        status:404,
        message:'Customer not found',
      };
    }

    const payment_detail = await CandidatePaymentDetails.findOne({where:{customer_id}});

    if(payment_detail){
      return{
        status:409,
        message:'Only one entry allowed.',
      };
    }
    
    // Create the candidate payment details
    const candidatePaymentDetail = await CandidatePaymentDetails.create({
      customer_id,
      account_holder_name,
      account_type,
      account_number,
      routing_number,
      representative_first_name,
      representative_last_name
    });

    return {
      status:200,
      message: "Candidate payment details added successfully.",
      data:candidatePaymentDetail,
    };

}

//add expertise of customer
async function customerUpdateExpertise(body) {
  try {
    const customer_id = body.customer_id;
    const expertise = body.expertise;
    const customer = await Customer.findOne({
      where: {
        customer_id,
      },
    });
    if (customer) {
      await Customer.update(
        {
          expertise: expertise,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );
    }
    return body;
  } catch (error) {
    console.log(`Error while updating Expertise ${error}`);
  }
}
//customers Api
async function getallcustomers(query) {
  try {
    let result = null;
    if (query?.customer_id) result = await Customer.findByPk(query?.customer_id);
    else {
      result = await Customer.findAll();
    }

    if (result) {
      return {
        status: 200,
        data: result,
      };
    }

    return {
      status: 404,
      message: "no customer",
      data: null,
    };
  } catch (error) {
    console.log(
      `Error while retrieving customers =>src->services->getallcustomers ${error} `
    );
    return;
  }
}



const getCustomerByEmail = async (email) => {
  try {
    const customer = await Customer.findOne({
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
      message: "customer not found",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

//get customer by id
const getCustomerByIdService = async (id) => {
  const client = await Customer.findOne({
    attributes: [
      "customer_id",
      "name",
      "over_all_exp",
      "email",
      "contact_no",
      "applied_through",
      "expertise",
      "position",
      "city",
      "area_code",
      "country",
      "province",
      "createdAt",
      "updatedAt",
    ],
    where: {
      customer_id: id,
    },
  });

  //const client= await Client.findByPk(id);

  if (client) {
    return client;
  } else {
    return null;
  }
};

const getCustomerExpertiseService = async (customer_id) => {
  const customer = await Customer.findByPk(customer_id);

  if (customer) {
    return {
      status: 200,
      message: "skills fetched successfully",
      data: customer.expertise,
    };
  }
  return {
    status: 404,
    message: "customer not found",
  };
};

const getJobsService = async (job_posting_id, talent_status) => {

  try {
    const job = await JobPostings.findOne({
      where: {
        job_posting_id
      },
      // include:[
      //   {
      //     model: Customer,
      //     as:'customer',
      //     on:{
      //       talent_status
      //     }
      //   }
      // ]
    });

    const assigned_customer= job.assigned_customer[0].customer_id;
  
    const customer= await Customer.findOne({
      where:{
        customer_id: assigned_customer,
        talent_status
      }
    })

    return {
      status: 200,
      message: "customer jobs fetched successfully",
      data: customer
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}


const changeStatusService = async (status, customer_id) => {
  try{
    const [updateCount] = await Customer.update({
      status
    }, {
      where: {
        customer_id
      }
    })

    if(updateCount > 0){
      return {
        status: 200,
        message: "Success"
      }
    }

    return {
        status: 404,
        message: "Update failed",
      }

  }catch(e){
    console.log(e);
    return {
      status: 500,
      message: e.message
    }
  }
}

const getNotificationCandidateService = async (candidate_id, date) => {
  try {
    if (!date) {
      return {
        status: 400,
        message: "Invalid date",
      };
    }

    await NotificationCandidates.update(
      {
        is_sent: true,
      },
      {
        where: {
          customer_id: candidate_id,
        },
      }
    );

    //console.log(notification)

    // const notification = await NotificationClient.findAll({
    //   where: { client_id }
    // });

    // if (!notification || notification.length === 0) {
    //   return {
    //     status: 400,
    //     message: "No notifications yet"
    //   };
    // }

    //const client_notifications = [];
    const client_notifications = await NotificationCandidates.findAll({
      order:[['updatedAt','DESC']],
      where: {
        customer_id: candidate_id,
      },
    });

    // Parse input date to a Date object for comparison
    const inputDate = new Date(date);
    console.log(inputDate);

    // for (let n of notification) {
    //   const notificationData = n.dataValues;
    //   const sendDate = new Date(notificationData.send_date).toISOString(); //remove toISOString() for the logic of 1 day
    //   let send_minute= sendDate.split(':')[1] //remove this code for 1 day
    //   const date_minute= date.split(':')[1]  // remove this code for 1 day
    //   console.log(parseInt(send_minute)+4) // remove this code for 1 day
    //   console.log(date_minute)  // remove this code for 1 day
    //   send_minute= parseInt(send_minute)+4;
    //   if(send_minute>59){  // case: if the send minute passes 1 hour, so it would be 60, but date_minute would consider 0
    //     send_minute=0;
    //   }

    //   if (!notificationData.is_sent && send_minute <= parseInt(date_minute)) {
    //     // If send_date has passed, mark the notification as sent
    //     await n.update({ is_sent: true });
    //     console.log(`Notification sent for client ${client_id} on ${inputDate}`);
    //   }

    //   if(notificationData.is_sent){
    //     client_notifications.push(notificationData);
    //   }

    //   // Check if the notification is not sent yet
    //   //this is for code after 1 day
    //   // if (!notificationData.is_sent) {
    //   //   // Compare send_date using getTime() to avoid millisecond issues
    //   //   const sendDate = new Date(notificationData.send_date);
    //   //   const inputDateObj = new Date(date);

    //   //   //this is for code after 1 day
    //   //   if (sendDate.getFullYear() === inputDateObj.getFullYear() &&
    //   //     sendDate.getMonth() === inputDateObj.getMonth() &&
    //   //     sendDate.getDate() === inputDateObj.getDate()) {
    //   //     await n.update({ is_sent: true });
    //   //     console.log(`Notification sent for client ${client_id} on ${date}`);
    //   //   }

    //   // }

    //   // if(notificationData.is_sent){
    //   //   client_notifications.push(notificationData);
    //   // }
    // }

    return {
      status: 200,
      message: "Notifications fetched successfully",
      data: client_notifications,
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message,
    };
  }
};

const createCustomerStripeAccountService = async (body) => {
  const { customer_id, stripe_id } = body;
  let msg = null;
  try {
    const customerFind = await Customer.findOne({
      where: {
        customer_id,
      },
    });

    if (!customerFind) {
      return {
        status: 404,
        message: "customer not found",
      };
    }
    await Payment_Customer.create({
      customer_id,
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

const getCustomerStripeAccountService = async (query) => {
  const { customer_id } = query;
  try {
    const payment = await Payment_Customer.findOne({
      where: {
        customer_id,
      },
    });

    if (payment)
      return {
        status: 200,
        message: "customer account fetched successfully",
        data: payment,
      };

    return {
      status: 404,
      message: "Customer account not registered",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};


module.exports = {
  getCustomerByIdService,
  getCustomerViaExpertise,
  getallcustomers,
  customerUpdateExpertise,
  getCustomertestsService,
  getcodingresultService,
  getCustomerExpertiseService,
  getCustomerByEmail,
  getJobsService,
  addCandidatePayment,
  getCandidatePaymentService,
  changeStatusService,
  createCustomerStripeAccountService,
  getCustomerStripeAccountService,
  getNotificationCandidateService
};
