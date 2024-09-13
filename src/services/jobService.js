const JobPostings = require("../models/jobPostings")

const getAllJobsService=async ()=>{
    const result= await JobPostings.findAll();
    return{
        status: 200,
        result
    }
}

module.exports={
    getAllJobsService
}