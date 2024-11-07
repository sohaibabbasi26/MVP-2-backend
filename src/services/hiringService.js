const Client = require("../models/client");
const Customer = require("../models/customer");
const HiringPayment = require("../models/hiring_payment");
const JobPostings = require("../models/jobPostings");

const createHiringService = async (req) => {
  const body = req?.body;
  try {
    await HiringPayment.create({
      ...body,
    });
    return {
      status: 200,
      message: "hiring created successfully",
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message,
    };
  }
};

const getHiringPaymentService = async (req) => {
  const { job_posting_id, stripe_client_id } = req?.query;

  JobPostings.hasOne(HiringPayment, { foreignKey: "job_posting_id" });
  HiringPayment.belongsTo(JobPostings, { foreignKey: "job_posting_id" });

  Client.hasOne(HiringPayment, { foreignKey: "client_id" });
  HiringPayment.belongsTo(Client, { foreignKey: "client_id" });

  Customer.hasOne(HiringPayment, { foreignKey: "customer_id" });
  HiringPayment.belongsTo(Customer, { foreignKey: "customer_id" });

  let hiringPaymtByJob = null;

  if (!job_posting_id && !stripe_client_id) {
    hiringPaymtByJob = await HiringPayment.findOne({
      include: [
        {
          model: Client,
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: Customer,
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: JobPostings,
          // attributes:{
          //     exclude:['password']
          // }
        },
      ],
    });
  }
  
  if(job_posting_id && !stripe_client_id){
    hiringPaymtByJob = await HiringPayment.findOne({
        where:{
            job_posting_id
        },
        include: [
          {
            model: Client,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: Customer,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: JobPostings,
            // attributes:{
            //     exclude:['password']
            // }
          },
        ],
      });
  }

  if(!job_posting_id && stripe_client_id){
    hiringPaymtByJob = await HiringPayment.findAll({
        where:{
            stripe_client_id
        },
        include: [
          {
            model: Client,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: Customer,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: JobPostings,
            // attributes:{
            //     exclude:['password']
            // }
          },
        ],
      });
  }
  if (!hiringPaymtByJob) {
    return {
      status: 404,
      message: "No hirings found yet",
    };
  }

  return {
    status: 200,
    message: "Hirings fetched",
    data: hiringPaymtByJob,
  };
};

module.exports = {
  createHiringService,
  getHiringPaymentService,
};
