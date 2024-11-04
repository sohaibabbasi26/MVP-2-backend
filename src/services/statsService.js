const Client = require("../models/client");
const Customer = require("../models/customer");
const JobPostings = require("../models/jobPostings");
const Result = require("../models/results");

const getJobStats = async (job_status) => {
  let job = null;
  if (!job_status) {
    job = await JobPostings.findAll();
  } else {
    job = await JobPostings.findAll({
      where: {
        job_status,
      },
    });
  }
  return job.length;
};

const getCandidateStats = async (talent_status) => {
  let candidates = null;
  let count = 0;
  if (!talent_status) {
    candidates = await Customer.findAll();
  } else {
    candidates = await Customer.findAll({
      where: {
        talent_status,
      },
    });

    if (talent_status === "open") {
      for (let candidate of candidates) {
        const hasCustomerGivenTest = await Result.findOne({
          where: {
            customer_id: candidate.customer_id,
          },
        });

        if (hasCustomerGivenTest) {
          count++;
        }
      }
    } else {
      count = candidates.length;
    }

    //check if the customer has given the test or not
  }
  return count;
};

const getClientStats = async (hasJob) => {
  let count = 0;
  Client.hasMany(JobPostings, { foreignKey: "client_id" });
  JobPostings.belongsTo(Client, { foreignKey: "client_id" });
  const result = await Client.findAll({
    include: [
      {
        model: JobPostings,
      },
    ],
    attributes: {
      exclude: ["password"],
    },
  });

  if (hasJob) {
    //const jobPos
    for (let r of result) {
      if (r.job_postings?.length > 0) {
        count++;
      }
    }
    return count;
  }

  for (let r of result) {
    if (r.job_postings?.length === 0) {
      count++;
    }
  }
  return count;
};

module.exports = {
  getJobStats,
  getCandidateStats,
  getClientStats,
};
